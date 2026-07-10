"use client"

import CollectionCard from "@/components/collection/collection-card"
import CreateCollection from "@/components/collection/create-collection"
import LoadingAndRetry from "@/components/shared/loading-and-retry"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"
import { SearchX } from "lucide-react"

export default function Page() {
  const trpc = useTRPC()
  const {
    data: collections,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.collection.readAll.queryOptions())

  if (isLoading || isError) {
    return (
      <LoadingAndRetry
        isLoading={isLoading}
        isError={isError}
        retry={refetch}
      />
    )
  }

  // empty view
  if (collections === undefined || collections.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No Collections Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any collections yet. Get started by
            creating your first collection.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex w-full flex-col gap-4">
            <CreateCollection />
            <Separator />
            <Button variant="outline">Import Collection</Button>
          </div>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex grow overflow-x-auto p-4">
      <div className="container mx-auto flex w-full lg:w-1/2">
        <div className="mt-4 flex w-full gap-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
          <CreateCollection />
        </div>
      </div>
    </div>
  )
}
