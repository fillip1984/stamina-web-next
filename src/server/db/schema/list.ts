import { user } from "./auth"
import { baseFields, baseSchema } from "./base"
import { ListTypeEnum } from "./enums"

export const list = baseSchema.table("list", (t) => ({
  ...baseFields,
  name: t.varchar("name", { length: 256 }).notNull(),
  description: t.text("description"),
  type: ListTypeEnum("type").default("GENERAL").notNull(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}))

export const task = baseSchema.table("task", (t) => ({
  ...baseFields,
  name: t.varchar("name", { length: 256 }).notNull(),
  description: t.text("description"),
  complete: t.boolean("complete").default(false).notNull(),
  listId: t
    .text("list_id")
    .notNull()
    .references(() => list.id, { onDelete: "cascade" }),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}))
