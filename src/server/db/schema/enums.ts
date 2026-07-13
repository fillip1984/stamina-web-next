import {
  BloodPressureCategoryEnumValues,
  CollectionEnumValues,
  DayOfWeekEnumValues,
  DaytimeEnumValues,
  OnCompleteEnumValues,
  TaskPriorityEnumValues,
  TaskStatusEnumValues,
  TaskTypeEnumValues,
} from "@/client/enums"
import { baseSchema } from "./base"

export const collectionPgEnum = baseSchema.enum(
  "collection_enum",
  CollectionEnumValues
)

export const taskStatusPgEnum = baseSchema.enum(
  "task_status_enum",
  TaskStatusEnumValues
)

export const taskPriorityPgEnum = baseSchema.enum(
  "task_priority_enum",
  TaskPriorityEnumValues
)

export const taskTypePgEnum = baseSchema.enum(
  "task_type_enum",
  TaskTypeEnumValues
)

export const daytimePgEnum = baseSchema.enum("daytime_enum", DaytimeEnumValues)

export const dayOfWeekPgEnum = baseSchema.enum(
  "day_of_week_enum",
  DayOfWeekEnumValues
)

export const onCompletePgEnum = baseSchema.enum(
  "on_complete_enum",
  OnCompleteEnumValues
)

export const bloodPressureCategoryPgEnum = baseSchema.enum(
  "blood_pressure_category_enum",
  BloodPressureCategoryEnumValues
)
