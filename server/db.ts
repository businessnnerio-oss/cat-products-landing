import { eq, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clicks, InsertClick } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Click tracking functions
export async function trackClick(productId: string, userAgent?: string, referrer?: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track click: database not available");
    return;
  }

  try {
    const clickData: InsertClick = {
      productId,
      userAgent: userAgent || null,
      referrer: referrer || null,
    };
    await db.insert(clicks).values(clickData);
  } catch (error) {
    console.error("[Database] Failed to track click:", error);
  }
}

export async function getClickStats(): Promise<Array<{ productId: string; clickCount: number }>> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get click stats: database not available");
    return [];
  }

  try {
    const result = await db
      .select({
        productId: clicks.productId,
        clickCount: count().as("count"),
      })
      .from(clicks)
      .groupBy(clicks.productId);

    return result.map(row => ({
      productId: row.productId,
      clickCount: typeof row.clickCount === 'number' ? row.clickCount : 0,
    }));
  } catch (error) {
    console.error("[Database] Failed to get click stats:", error);
    return [];
  }
}
