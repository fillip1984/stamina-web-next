import { baseSchema } from "./base"

export const CollectionTypeEnum = baseSchema.enum("collection_type", [
  "GENERAL",
  "TMDB",
])
