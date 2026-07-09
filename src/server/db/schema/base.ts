import { env } from "@/env"
import { createId } from "@paralleldrive/cuid2"
import { pgSchema, text, timestamp } from "drizzle-orm/pg-core"

/**
 * Table schema is used to separate different applications using the same database.
 */
export const baseSchema = pgSchema(env.DATABASE_SCHEMA)

/**
 * Base fields for all tables.
 */
export const baseFields = {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(
    () => /* @__PURE__ */ new Date()
  ),
}
