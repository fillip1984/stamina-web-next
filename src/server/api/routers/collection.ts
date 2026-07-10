import { z } from "zod"

import { collection } from "@/server/db/schema"

import { and, eq } from "drizzle-orm"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(collection).values({
        ...input,
        userId: ctx.session.user.id,
      })
    }),

  readAll: protectedProcedure.query(async ({ ctx }) => {
    const results = ctx.db.query.collection.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        name: "asc",
      },
      columns: {
        createdAt: false,
        updatedAt: false,
        userId: false,
      },
    })
    // const results = ctx.db._query.collection.findMany({
    //   where: eq(collection.userId, ctx.session.user.id),
    //   columns: {
    //     createdAt: false,
    //     updatedAt: false,
    //     userId: false,
    //   },
    //   orderBy: (collection, { asc }) => [asc(collection.name)],
    // });

    // TODO: there's a bug in drizzle for performing counts on child objects,
    // check back once drizzle 1.0 drops
    const collectionsWithTaskCount = (await results).map(
      async (collectionItem) => {
        const tasks = await ctx.db.query.task.findMany({
          where: {
            collectionId: collectionItem.id,
          },
          columns: {
            id: true,
            complete: true,
          },
        })
        // const collectionsWithTaskCount = (await results).map(async (collectionItem) => {
        //   const tasks = await ctx.db._query.task.findMany({
        //     where: eq(task.collectionId, collectionItem.id),
        //     columns: {
        //       id: true,
        //       complete: true,
        //     },
        //   });
        const taskCount = tasks.length
        const completedTaskCount = tasks.filter((task) => task.complete).length
        return { ...collectionItem, taskCount, completedTaskCount }
      }
    )

    return Promise.all(collectionsWithTaskCount)
  }),

  readById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // const result = await ctx.db._query.collection.findFirst({
      //   // where: and(eq(collection.id, input.id), eq(collection.userId, ctx.session.user.id)),
      //   where: {
      //     id: input.id,
      //     userId: ctx.session.user.id,
      //   }
      //   with: {
      //     tasks: {
      //       // where: eq(task.collectionId, input.id),
      //       orderBy: { task: { createdAt: "asc" } },
      //       columns: {
      //         createdAt: false,
      //         updatedAt: false,
      //         userId: false,
      //       },
      //     },
      //   },
      //   columns: {
      //     createdAt: false,
      //     updatedAt: false,
      //     userId: false,
      //   },
      // });
      const result = await ctx.db.query.collection.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        with: {
          tasks: {
            orderBy: { createdAt: "asc" },
            columns: {
              createdAt: false,
              updatedAt: false,
              userId: false,
            },
          },
        },
        columns: {
          createdAt: false,
          updatedAt: false,
          userId: false,
        },
      })
      return result ?? null
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await ctx.db
        .update(collection)
        .set(data)
        .where(
          and(eq(collection.id, id), eq(collection.userId, ctx.session.user.id))
        )
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(collection)
        .where(
          and(
            eq(collection.id, input.id),
            eq(collection.userId, ctx.session.user.id)
          )
        )
    }),
})
