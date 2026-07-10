import type { CollectionSummaryType } from "@/server/api/types"

export default function CollectionCard({
  collection,
}: {
  collection: CollectionSummaryType
}) {
  return (
    <div className="flex h-40 w-80 shrink-0 flex-col items-center justify-center rounded-xl border p-4">
      {collection.name}
    </div>
  )
}
