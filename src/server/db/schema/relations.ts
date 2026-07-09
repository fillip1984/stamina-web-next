import { defineRelations } from "drizzle-orm"

import * as schema from "./index"

export const relations = defineRelations(schema, (r) => ({
  list: {
    tasks: r.many.task(),
    user: r.one.user({
      from: r.list.userId,
      to: r.user.id,
    }),
  },
  task: {
    list: r.one.list({
      from: r.task.listId,
      to: r.list.id,
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
