import { z } from "zod"

import { db } from "@/server/db"
import { task } from "@/server/db/schema"
import { and, eq } from "drizzle-orm"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        listId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db.insert(task).values({
        ...input,
        userId: ctx.session.user.id,
      })
    }),

  // readAll: protectedProcedure.query(async ({ ctx }) => {
  //   return await db.query.task.findMany({
  //     where: eq(task.userId, ctx.session.user.id),
  //   });
  // }),

  // readById: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     return await db.query.task.findFirst({
  //       where: and(eq(task.id, input.id), eq(task.userId, ctx.session.user.id)),
  //       with: {
  //         tasks: true,
  //       },
  //     });
  //   }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().nullish(),
        complete: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await db
        .update(task)
        .set(data)
        .where(and(eq(task.id, id), eq(task.userId, ctx.session.user.id)))
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db
        .delete(task)
        .where(and(eq(task.id, input.id), eq(task.userId, ctx.session.user.id)))
    }),
})
