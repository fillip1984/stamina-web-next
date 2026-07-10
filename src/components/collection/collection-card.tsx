import type { CollectionSummaryType } from "@/server/api/types"
import Link from "next/link"

export default function CollectionCard({
  collection,
}: {
  collection: CollectionSummaryType
}) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="flex h-40 w-80 shrink-0 flex-col items-center justify-center rounded-xl border p-4"
    >
      {collection.name}
    </Link>
  )
}
