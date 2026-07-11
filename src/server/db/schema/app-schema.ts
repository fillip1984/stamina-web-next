import { user } from "./auth"
import { baseFields, baseSchema } from "./base"
import {
  bloodPressureCategoryPgEnum,
  CollectionTypeEnum,
  dayOfWeekPgEnum,
  daytimePgEnum,
  measurablePgEnum,
  onCompletePgEnum,
  PriorityEnum,
  StatusEnum,
} from "./enums"

export const collections = baseSchema.table("collection", (t) => ({
  ...baseFields,
  name: t.varchar("name", { length: 256 }).notNull(),
  description: t.text("description"),
  type: CollectionTypeEnum("type").default("GENERAL").notNull(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}))

export const tags = baseSchema.table("tag", (t) => ({
  ...baseFields,
  name: t.text("name").notNull(),
  description: t.text("description").notNull(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id),
}))

export const tasks = baseSchema.table("task", (t) => ({
  ...baseFields,
  name: t.varchar("name", { length: 256 }).notNull(),
  description: t.text("description"),
  complete: t.boolean("complete").default(false).notNull(),
  status: StatusEnum("status").notNull().default("todo"),
  priority: PriorityEnum("priority"),
  dueDate: t.timestamp(),
  // dueDate: t.date("due_date", { mode: "string" }),
  position: t.integer("position"),
  type: measurablePgEnum("type").notNull(),
  setDate: t.timestamp("set_date").notNull(),
  suggestedDayTime: daytimePgEnum("suggested_day_time"),
  suggestedDay: dayOfWeekPgEnum("suggested_day"),
  interval: t.integer("interval"),
  onComplete: onCompletePgEnum("on_complete"),
  collectionId: t
    .text("collection_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}))

export const results = baseSchema.table("result", (t) => ({
  ...baseFields,
  date: t.timestamp("date").notNull(),
  notes: t.text("notes").notNull(),
  taskId: t.text("task_id").notNull(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id),
}))

export const weighIns = baseSchema.table("weigh_in", (t) => ({
  ...baseFields,
  date: t.timestamp("date").notNull(),
  weight: t.real("weight").notNull(),
  bodyFatPercentage: t.real("body_fat_percentage"),
  previousWeighInId: t.text("previous_weigh_in_id"),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id),
}))

export const weightGoals = baseSchema.table("weight_goal", (t) => ({
  ...baseFields,
  weight: t.real("weight"),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id),
}))

export const bloodPressureReadings = baseSchema.table(
  "blood_pressure_reading",
  (t) => ({
    ...baseFields,
    date: t.timestamp("date").notNull(),
    systolic: t.integer("systolic").notNull(),
    diastolic: t.integer("diastolic").notNull(),
    pulse: t.integer("pulse"),
    category: bloodPressureCategoryPgEnum("category").notNull(),
    previousBloodPressureReadingId: t.text(
      "previous_blood_pressure_reading_id"
    ),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id),
  })
)
