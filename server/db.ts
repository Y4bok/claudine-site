import { and, desc, eq, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { conversations, InsertMessage, InsertProfile, messages, profiles, users, type InsertUser } from "../drizzle/schema";
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

// ─── Profiles ─────────────────────────────────────────────────────────────────

export async function upsertProfile(data: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(profiles).values(data).onDuplicateKeyUpdate({
    set: {
      pseudo: data.pseudo,
      enseigne: data.enseigne,
      ville: data.ville,
      reductionPct: data.reductionPct,
      enseignesRecherchees: data.enseignesRecherchees,
      isPublic: data.isPublic,
    },
  });
}

export async function getProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result[0];
}

export async function listPublicProfiles(excludeUserId?: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      profile: profiles,
      user: { id: users.id, name: users.name, email: users.email },
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(
      excludeUserId
        ? and(eq(profiles.isPublic, true), ne(profiles.userId, excludeUserId))
        : eq(profiles.isPublic, true)
    )
    .orderBy(desc(profiles.updatedAt))
    .limit(200);
  return rows;
}

// ─── Conversations ────────────────────────────────────────────────────────────

export async function getOrCreateConversation(userAId: number, userBId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const [minId, maxId] = userAId < userBId ? [userAId, userBId] : [userBId, userAId];
  const existing = await db
    .select()
    .from(conversations)
    .where(
      or(
        and(eq(conversations.userAId, minId), eq(conversations.userBId, maxId)),
        and(eq(conversations.userAId, maxId), eq(conversations.userBId, minId))
      )
    )
    .limit(1);
  if (existing[0]) return existing[0];
  await db.insert(conversations).values({ userAId: minId, userBId: maxId });
  const created = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.userAId, minId), eq(conversations.userBId, maxId)))
    .limit(1);
  return created[0]!;
}

export async function listConversationsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(conversations)
    .where(or(eq(conversations.userAId, userId), eq(conversations.userBId, userId)))
    .orderBy(desc(conversations.updatedAt));
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function sendMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(messages).values(data);
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, data.conversationId));
}

export async function listMessages(conversationId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

export async function countUnreadMessages(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(messages)
    .innerJoin(conversations, eq(messages.conversationId, conversations.id))
    .where(
      and(
        or(eq(conversations.userAId, userId), eq(conversations.userBId, userId)),
        ne(messages.senderId, userId),
        sql`${messages.readAt} IS NULL`
      )
    );
  return result[0]?.count ?? 0;
}
