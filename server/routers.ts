import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { trackClick, getClickStats } from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  clicks: router({
    trackClick: publicProcedure
      .input(z.object({
        productId: z.string(),
        userAgent: z.string().optional(),
        referrer: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await trackClick(input.productId, input.userAgent, input.referrer);
        return { success: true };
      }),
    getStats: publicProcedure
      .query(async () => {
        return await getClickStats();
      }),
  }),

  assistant: router({
    chat: publicProcedure
      .input(z.object({
        message: z.string(),
        conversationHistory: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `Eres un asistente amable y experto en nutrición felina y productos para gatos de Cat Paradise.
Tienes conocimiento sobre:
- Nutrición felina y alimentos premium
- Beneficios de los productos que ofrecemos
- Cuidado y bienestar de gatos
- Recomendaciones basadas en necesidades específicas

Productos disponibles:
1. Minino Plus Premium ($147) - Alimento seco adulto sabor carne, pollo y pavo
2. Purina Excellent Urinary ($996) - Croquetas sabor pollo y arroz 7.5kg para salud urinaria
3. Nupec Felino Adulto ($736) - Nutrición especializada pollo, salmón y arroz
4. Kit Momovida ($98) - Láser y plumas interactivas
5. Puntero Láser 7 en 1 ($127) - USB recargable con 7 funciones
6. Juguete Elevación Automática ($187) - Con cuerda elástica interactiva

Responde siempre en español, sé conciso y útil. Si el usuario pregunta sobre productos, recomienda según sus necesidades.`;

        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...(input.conversationHistory || []),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({
          messages: messages as any,
        });

        const reply = response.choices[0]?.message?.content || "No pude procesar tu mensaje. Intenta de nuevo.";

        return { reply };
      }),
  }),
});

export type AppRouter = typeof appRouter;
