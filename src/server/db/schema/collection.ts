import { user } from "./auth"
import { baseFields, baseSchema } from "./base"
import { CollectionTypeEnum } from "./enums"

export const collection = baseSchema.table("collection", (t) => ({
  ...baseFields,
  name: t.varchar("name", { length: 256 }).notNull(),
  description: t.text("description"),
  type: CollectionTypeEnum("type").default("GENERAL").notNull(),
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
  collectionId: t
    .text("collection_id")
    .notNull()
    .references(() => collection.id, { onDelete: "cascade" }),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}))
