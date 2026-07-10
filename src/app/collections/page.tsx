"use client"

import { useQuery } from "@tanstack/react-query"
import { SearchX } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import CollectionCard from "@/components/collection/collection-card"
import CreateCollection from "@/components/collection/create-collection"
import LoadingAndRetry from "@/components/shared/loading-and-retry"
import Container from "@/components/styled-components/container"
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

export default function CollectionListPage() {
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
  if (collections?.length === 0) {
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

  // default view
  return (
    <Container scrollToTopButton={true}>
      <div className="rounded-xl p-2">
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {collections?.map((collection) => (
              <motion.div
                key={collection.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  delayChildren: 0.2,
                }}
              >
                <CollectionCard collection={collection} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-xl p-4">
        <CreateCollection />
      </div>
    </Container>
  )
}
