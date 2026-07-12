import {
  collections,
  DayOfWeekEnum,
  DaytimeEnum,
  OnCompleteEnum,
  TaskEnum,
  tasks,
} from "@/server/db/schema"
import z from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const adminRouter = createTRPCRouter({
  exportData: protectedProcedure.mutation(async ({ ctx }) => {
    const collections = await ctx.db.query.collections.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    })
    // const collections = await ctx.db._query.collection.findMany({
    //   where: eq(collection.userId, ctx.session.user.id),
    // });

    const tasks = await ctx.db.query.tasks.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    })
    // const tasks = await ctx.db._query.task.findMany({
    //   where: eq(task.userId, ctx.session.user.id),
    // });

    return {
      collections,
      tasks,
    }
  }),
  importData: protectedProcedure
    .input(
      z.object({
        collections: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
          })
        ),
        tasks: z.array(
          z.object({
            id: z.string(),
            name: z.string().min(1),
            description: z.string().optional(),
            type: z.enum(TaskEnum),
            setDate: z.date(),
            suggestedDay: z.enum(DayOfWeekEnum).nullable(),
            suggestedDayTime: z.enum(DaytimeEnum).nullable(),
            dueDate: z.date().nullable(),
            interval: z.number().min(1).optional(),
            onComplete: z.enum(OnCompleteEnum).nullable(),
            collectionId: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      for (const collection of input.collections) {
        const existingCollection = await ctx.db.query.collections.findFirst({
          where: { id: collection.id, userId: ctx.session.user.id },
        })
        if (!existingCollection) {
          await ctx.db.insert(collections).values({
            name: collection.name,
            description: collection.description,
            userId: ctx.session.user.id,
          })
        }
      }

      for (const task of input.tasks) {
        const existingtask = await ctx.db.query.tasks.findFirst({
          where: {
            id: task.id,
            userId: ctx.session.user.id,
          },
          //{ id: task.id, userId: ctx.session.user.id },
        })
        if (existingtask) continue

        await ctx.db.insert(tasks).values({
          name: task.name,
          description: task.description,
          type: task.type,
          setDate: task.setDate,
          suggestedDay: task.suggestedDay,
          suggestedDayTime: task.suggestedDayTime,
          dueDate: task.dueDate,
          interval: task.interval,
          onComplete: task.onComplete,
          collectionId: task.collectionId,
          userId: ctx.session.user.id,
        })
      }
    }),
})
