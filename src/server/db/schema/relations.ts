import { defineRelations } from "drizzle-orm"

import * as schema from "./index"

export const relations = defineRelations(schema, (r) => ({
  collection: {
    tasks: r.many.task(),
    user: r.one.user({
      from: r.collection.userId,
      to: r.user.id,
    }),
  },
  task: {
    collection: r.one.collection({
      from: r.task.collectionId,
      to: r.collection.id,
    }),
    user: r.one.user({
      from: r.task.userId,
      to: r.user.id,
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
