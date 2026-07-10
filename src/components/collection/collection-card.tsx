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
      className="flex h-40 min-w-80 shrink-0 flex-col rounded-xl border p-4 hover:border-primary hover:text-primary"
    >
      <h4>{collection.name}</h4>
      <p className="text-sm text-muted-foreground">{collection.description}</p>
    </Link>
  )
}
