import type { RouterOutputs } from "."

export type CollectionSummaryType =
  RouterOutputs["collection"]["readAll"][number]
export type CollectionDetailType = NonNullable<
  RouterOutputs["collection"]["readById"]
>
export type TaskType = CollectionDetailType["tasks"][number]

export type TagType = RouterOutputs["tag"]["findAll"][number]
export type ResultType = RouterOutputs["result"]["findAll"][number]
export type BloodPressureReadingType = NonNullable<
  ResultType["bloodPressureReading"]
>
export type WeighInType = NonNullable<ResultType["weighIn"]>
