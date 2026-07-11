import { z } from "zod/v4"

import { results } from "@/server/db/schema"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const resultRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ taskId: z.string(), notes: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(results).values({
        taskId: input.taskId,
        notes: input.notes,
        date: new Date(),
        userId: ctx.session.user.id,
      })
    }),
  findAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.results.findMany({
      where: { userId: ctx.session.user.id },
      with: {
        bloodPressureReading: true,
        weighIn: true,
      },
      orderBy: (result, { desc }) => desc(result.date),
    })
  }),
})
