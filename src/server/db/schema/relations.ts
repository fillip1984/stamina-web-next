import { defineRelations } from "drizzle-orm"

import * as schema from "./index"

export const relations = defineRelations(schema, (r) => ({
  collections: {
    tasks: r.many.tasks({
      from: r.collections.id,
      to: r.tasks.collectionId,
    }),
    user: r.one.user({
      from: r.collections.userId,
      to: r.user.id,
    }),
  },
  tasks: {
    collection: r.one.collections({
      from: r.tasks.collectionId,
      to: r.collections.id,
    }),
    tags: r.many.tasks(),
    user: r.one.user({
      from: r.tasks.userId,
      to: r.user.id,
    }),
  },
  results: {
    weighIn: r.one.weighIns({
      from: r.results.taskId,
      to: r.weighIns.id,
    }),
    bloodPressureReading: r.one.bloodPressureReadings({
      from: r.results.taskId,
      to: r.bloodPressureReadings.id,
    }),
    user: r.one.user({
      from: r.results.userId,
      to: r.user.id,
    }),
  },
  weighIns: {
    weighIns: r.one.weighIns({
      from: r.weighIns.previousWeighInId,
      to: r.weighIns.id,
    }),
    user: r.one.user({
      from: r.weighIns.userId,
      to: r.user.id,
    }),
  },
  weightGoals: {
    user: r.one.user({
      from: r.weightGoals.userId,
      to: r.user.id,
    }),
  },
  bloodPressureReadings: {
    bloodPressureReadings: r.one.bloodPressureReadings({
      from: r.bloodPressureReadings.previousBloodPressureReadingId,
      to: r.bloodPressureReadings.id,
    }),
  },
  // auth relations
  // session: {
  //   user: r.one.user({
  //     from: r.session.userId,
  //     to: r.user.id,
  //   }),
  // },
  // account: {
  //   user: r.one.user({
  //     from: r.account.userId,
  //     to: r.user.id,
  //   }),
  // },
}))
