import { baseSchema } from "./base"

export const CollectionTypeEnum = baseSchema.enum("collection_type", [
  "GENERAL",
  "TMDB",
])

export const StatusEnum = baseSchema.enum("todo_status", [
  "todo",
  "in_progress",
  "blocked",
  "done",
])

export const PriorityEnum = baseSchema.enum("todo_priority", [
  "important",
  "urgent",
  "frantic",
])

// Enums, https://github.com/drizzle-team/drizzle-orm/discussions/1914
export enum MeasurableEnum {
  Tally = "Tally",
  Countdown = "Countdown",
  Seeking = "Seeking",
}
export const measurablePgEnum = baseSchema.enum(
  "measurableEnum",
  MeasurableEnum
)

export enum DaytimeEnum {
  Morning = "Morning",
  Afternoon = "Afternoon",
  Evening = "Evening",
  Night = "Night",
}
export const daytimePgEnum = baseSchema.enum("daytimeEnum", DaytimeEnum)

export enum DayOfWeekEnum {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}
export const dayOfWeekPgEnum = baseSchema.enum("dayOfWeekEnum", DayOfWeekEnum)

export enum OnCompleteEnum {
  Note = "Note",
  Weigh_in = "Weigh_in",
  Blood_pressure_reading = "Blood_pressure_reading",
  Runners_log = "Runners_log",
}
export const onCompletePgEnum = baseSchema.enum(
  "onCompleteEnum",
  OnCompleteEnum
)

export enum BloodPressureCategoryEnum {
  Low = "Low",
  Normal = "Normal",
  Elevated = "Elevated",
  Hypertension_1 = "Hypertension_1",
  Hypertension_2 = "Hypertension_2",
  Hypertension_crisis = "Hypertension_crisis",
}
export const bloodPressureCategoryPgEnum = baseSchema.enum(
  "bloodPressureCategoryEnum",
  BloodPressureCategoryEnum
)
