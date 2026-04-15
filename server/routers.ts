import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  countUnreadMessages,
  getOrCreateConversation,
  getProfileByUserId,
  listConversationsForUser,
  listMessages,
  listPublicProfiles,
  sendMessage,
  upsertProfile,
} from "./db";

export const appRouter = router({
  system: systemRouter,

  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Profiles ───────────────────────────────────────────────────────────
  profile: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      return getProfileByUserId(ctx.user.id);
    }),
    save: protectedProcedure
      .input(
        z.object({
          pseudo: z.string().max(100).optional(),
          enseigne: z.string().max(100).optional(),
          ville: z.string().max(100).optional(),
          reductionPct: z.number().int().min(0).max(100).optional(),
          enseignesRecherchees: z.array(z.string()).optional(),
          isPublic: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await upsertProfile({
          userId: ctx.user.id,
          pseudo: input.pseudo ?? null,
          enseigne: input.enseigne ?? null,
          ville: input.ville ?? null,
          reductionPct: input.reductionPct ?? 0,
          enseignesRecherchees: input.enseignesRecherchees ?? [],
          isPublic: input.isPublic ?? true,
        });
        return { success: true };
      }),
    list: publicProcedure.query(async ({ ctx }) => {
      const excludeId = ctx.user?.id;
      return listPublicProfiles(excludeId);
    }),
    byUserId: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return getProfileByUserId(input.userId);
      }),
  }),

  // ─── Chat ─────────────────────────────────────────────────────────────────
  chat: router({
    getOrCreateConversation: protectedProcedure
      .input(z.object({ otherUserId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return getOrCreateConversation(ctx.user.id, input.otherUserId);
      }),
    myConversations: protectedProcedure.query(async ({ ctx }) => {
      const convos = await listConversationsForUser(ctx.user.id);
      const enriched = await Promise.all(
        convos.map(async (c) => {
          const otherId = c.userAId === ctx.user.id ? c.userBId : c.userAId;
          const otherProfile = await getProfileByUserId(otherId);
          return { ...c, otherUserId: otherId, otherProfile };
        })
      );
      return enriched;
    }),
    messages: protectedProcedure
      .input(z.object({ conversationId: z.number(), limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const convos = await listConversationsForUser(ctx.user.id);
        const belongs = convos.some((c) => c.id === input.conversationId);
        if (!belongs) throw new Error("Unauthorized");
        const msgs = await listMessages(input.conversationId, input.limit ?? 50);
        return msgs.reverse();
      }),
    send: protectedProcedure
      .input(z.object({ conversationId: z.number(), content: z.string().min(1).max(2000) }))
      .mutation(async ({ ctx, input }) => {
        const convos = await listConversationsForUser(ctx.user.id);
        const belongs = convos.some((c) => c.id === input.conversationId);
        if (!belongs) throw new Error("Unauthorized");
        await sendMessage({
          conversationId: input.conversationId,
          senderId: ctx.user.id,
          content: input.content,
        });
        return { success: true };
      }),
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return countUnreadMessages(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
