import { z } from "zod/v4"

import { tags } from "@/server/db/schema"
import { and, eq } from "drizzle-orm"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(tags).values({
        name: input.name,
        description: input.description,
        userId: ctx.session.user.id,
      })
    }),
  findAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.tags.findMany({
      where: { userId: ctx.session.user.id },
      // orderBy: asc(tags.name),
      columns: { id: true, name: true, description: true },
      orderBy: {
        name: "asc",
      },
    })
  }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.tags.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(tags)
        .set({
          name: input.name,
          description: input.description,
        })
        .where(and(eq(tags.id, input.id), eq(tags.userId, ctx.session.user.id)))
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(tags)
        .where(and(eq(tags.id, input.id), eq(tags.userId, ctx.session.user.id)))
    }),
})
