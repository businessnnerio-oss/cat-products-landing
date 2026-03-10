import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { trackClick, getClickStats } from "./db";

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
});

export type AppRouter = typeof appRouter;
