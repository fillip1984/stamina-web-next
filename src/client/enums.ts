export const CollectionEnumValues = {
  GENERAL: "General",
  TMDB: "TMDB",
} as const
export type CollectionEnumType =
  (typeof CollectionEnumValues)[keyof typeof CollectionEnumValues]

export const TaskStatusEnumValues = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  DONE: "Done",
} as const
export type TaskStatusEnumType =
  (typeof TaskStatusEnumValues)[keyof typeof TaskStatusEnumValues]

export const TaskTypeEnumValues = {
  TODO: "Todo",
  RECURRING: "Recurring",
  SEEKING: "Seeking",
  TALLY: "Tally",
} as const
export type TaskTypeEnumType =
  (typeof TaskTypeEnumValues)[keyof typeof TaskTypeEnumValues]

export const TaskPriorityEnumValues = {
  IMPORTANT: "Important",
  URGENT: "Urgent",
  FRANTIC: "Frantic",
} as const
export type TaskPriorityEnumType =
  (typeof TaskPriorityEnumValues)[keyof typeof TaskPriorityEnumValues]

export const DaytimeEnumValues = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  NIGHT: "Night",
} as const
export type DaytimeEnumType =
  (typeof DaytimeEnumValues)[keyof typeof DaytimeEnumValues]

export const DayOfWeekEnumValues = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
} as const
export type DayOfWeekEnumType =
  (typeof DayOfWeekEnumValues)[keyof typeof DayOfWeekEnumValues]

export const OnCompleteEnumValues = {
  NOTE: "Note",
  WEIGH_IN: "Weigh In",
  BLOOD_PRESSURE_READING: "Blood Pressure Reading",
  RUNNERS_LOG: "Runners Log",
} as const
export type OnCompleteEnumType =
  (typeof OnCompleteEnumValues)[keyof typeof OnCompleteEnumValues]

export const BloodPressureCategoryEnumValues = {
  LOW: "Low",
  NORMAL: "Normal",
  ELEVATED: "Elevated",
  HYPERTENSION_1: "Hypertension Stage 1",
  HYPERTENSION_2: "Hypertension Stage 2",
  HYPERTENSION_CRISIS: "Hypertensive Crisis",
} as const
export type BloodPressureCategoryEnumType =
  (typeof BloodPressureCategoryEnumValues)[keyof typeof BloodPressureCategoryEnumValues]
