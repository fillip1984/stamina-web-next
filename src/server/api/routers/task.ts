import { z } from "zod"

import {
  DayOfWeekEnumValues,
  DaytimeEnumValues,
  OnCompleteEnumValues,
  TaskTypeEnumValues,
} from "@/client/enums"
import { determineCategory } from "@/lib/blood-pressure-utils"
import { calculateTaskProgress } from "@/lib/task-utils"
import { db } from "@/server/db"
import {
  bloodPressureReadings,
  results,
  tasks,
  weighIns,
} from "@/server/db/schema"
import { addDays, startOfDay } from "date-fns"
import { and, eq } from "drizzle-orm"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(TaskTypeEnumValues),
        setDate: z.date(),
        suggestedDay: z.enum(DayOfWeekEnumValues).nullable(),
        suggestedDayTime: z.enum(DaytimeEnumValues).nullable(),
        dueDate: z.date().nullable(),
        interval: z.number().min(1).optional(),
        onComplete: z.enum(OnCompleteEnumValues).nullable(),
        collectionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db.insert(tasks).values({
        ...input,
        userId: ctx.session.user.id,
      })
    }),

  // readAll: protectedProcedure.query(async ({ ctx }) => {
  //   return await db.query.task.findMany({
  //     where: eq(task.userId, ctx.session.user.id),
  //   });
  // }),
  readById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("Reading task with id:", input.id)
      return await db.query.tasks.findFirst({
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
        name: z.string().min(1),
        description: z.string().nullish(),
        type: z.enum(TaskTypeEnumValues).optional(),
        suggestedDay: z.enum(DayOfWeekEnumValues).nullable(),
        suggestedDayTime: z.enum(DaytimeEnumValues).nullable(),
        dueDate: z.date().nullable(),
        interval: z.number().min(1).optional(),
        onComplete: z.enum(OnCompleteEnumValues).nullable(),
        complete: z.boolean(),
        collectionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await db
        .update(tasks)
        .set(data)
        .where(and(eq(tasks.id, id), eq(tasks.userId, ctx.session.user.id)))
    }),
  complete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        weighIn: z
          .object({
            date: z.date(),
            weight: z.number(),
            bodyFatPercentage: z.number().optional(),
          })
          .nullish(),
        bloodPressureReading: z
          .object({
            date: z.date(),
            systolic: z.number(),
            diastolic: z.number(),
            pulse: z.number().optional(),
          })
          .nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, weighIn, bloodPressureReading } = input
      const task = await ctx.db.query.tasks.findFirst({
        where: { id, userId: ctx.session.user.id },
      })
      if (!task) {
        throw new Error("Task not found")
      }
      if (
        task.onComplete === OnCompleteEnumValues.WEIGH_IN && // Weigh_in
        !weighIn
      ) {
        throw new Error("Weigh in data is required to complete this measurable")
      }
      if (
        task.onComplete === OnCompleteEnumValues.BLOOD_PRESSURE_READING && // Blood_pressure_reading
        !bloodPressureReading
      ) {
        throw new Error(
          "Blood pressure reading data is required to complete this measurable"
        )
      }

      // increment setDate to previous dueDate
      // if no previous due date, and type was seeking, set to elapsed days
      // if no previous due date, and type was tally, leave due date undefined
      const { interval, elapsedDays } = calculateTaskProgress(
        task.setDate,
        task.dueDate ?? new Date()
      )
      const effectiveInterval = task.interval ?? interval
      const newSetDate = startOfDay(task.dueDate ?? new Date())
      const newDueDate =
        task.type === TaskTypeEnumValues.RECURRING
          ? startOfDay(addDays(newSetDate, effectiveInterval))
          : task.type === TaskTypeEnumValues.SEEKING
            ? startOfDay(addDays(newSetDate, elapsedDays))
            : undefined
      // task.setDate = newSetDate;
      // task.dueDate = newDueDate ?? null;

      // if we were seeking for interval and have set a dueDate, change to count down
      // if type was Recurring or Tally, leave alone
      const newType =
        task.type === TaskTypeEnumValues.SEEKING
          ? TaskTypeEnumValues.RECURRING
          : task.type

      const tx = ctx.db.transaction(async (db) => {
        const updatedMeasurable = await db
          .update(tasks)
          .set({
            type: newType,
            setDate: newSetDate,
            dueDate: newDueDate,
            interval: effectiveInterval,
          })
          .where(
            and(eq(tasks.id, task.id), eq(tasks.userId, ctx.session.user.id))
          )
          .returning()

        if (!updatedMeasurable[0]) {
          throw new Error("Failed to find task being completed")
        }

        const result = await db
          .insert(results)
          .values({
            taskId: id,
            userId: ctx.session.user.id,
            date: new Date(),
            notes: `Completed ${updatedMeasurable[0].name}`,
          })
          .returning()

        if (!result[0]) {
          throw new Error("Failed to record result of completing measurable")
        }

        if (weighIn) {
          const previousWeighIn = await db.query.weighIns.findFirst({
            where: { userId: ctx.session.user.id },
            orderBy: { date: "desc" },
          })

          await db.insert(weighIns).values({
            userId: ctx.session.user.id,
            date: weighIn.date,
            weight: weighIn.weight,
            bodyFatPercentage: weighIn.bodyFatPercentage,
            previousWeighInId: previousWeighIn ? previousWeighIn.id : null,
            // resultId: result[0].id,
          })
        } else if (bloodPressureReading) {
          const previousBloodPressureReading =
            await db.query.bloodPressureReadings.findFirst({
              where: {
                userId: ctx.session.user.id,
                date: { lt: bloodPressureReading.date },
              },
              orderBy: { date: "desc" },
            })
          const category = determineCategory(bloodPressureReading)
          await db.insert(bloodPressureReadings).values({
            userId: ctx.session.user.id,
            date: bloodPressureReading.date,
            systolic: bloodPressureReading.systolic,
            diastolic: bloodPressureReading.diastolic,
            pulse: bloodPressureReading.pulse,
            category,
            previousBloodPressureReadingId:
              previousBloodPressureReading?.id ?? null,
            // resultId: result[0].id,
          })
        }

        return {
          result,
          updatedMeasurable,
        }
      })

      return tx
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db
        .delete(tasks)
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, ctx.session.user.id))
        )
    }),
})
