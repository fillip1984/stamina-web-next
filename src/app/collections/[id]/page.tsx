"use client"

import TaskDetailsDialog from "@/components/collection/task/task-details-dialog"
import LoadingAndRetry from "@/components/shared/loading-and-retry"
import Container from "@/components/styled-components/container"
import InlineEditableInput from "@/components/styled-components/inline-editable-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTRPC } from "@/trpc/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowBigLeft,
  CogIcon,
  EllipsisIcon,
  ListChecksIcon,
  TrashIcon,
  TvIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function CollectionDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  // const collection = prefetch(trpc.collection.readById.queryOptions({ id }));
  const trpc = useTRPC()
  const {
    data: collection,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.collection.readById.queryOptions({ id }))

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  useEffect(() => {
    if (collection) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(collection.name)
      setDescription(collection.description ?? "")
    }
  }, [collection])

  const queryClient = useQueryClient()
  const updateCollection = useMutation(
    trpc.collection.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.collection.pathFilter())
      },
    })
  )
  const handleCollectionUpdate = () => {
    if (!collection) return
    // only update if changes were made
    if (name !== collection.name || description !== collection.description) {
      updateCollection.mutate({ ...collection, name, description })
    }
  }

  const router = useRouter()
  const deleteCollection = useMutation(
    trpc.collection.delete.mutationOptions({
      onSuccess: async () => {
        void queryClient.invalidateQueries(trpc.collection.pathFilter())
        router.replace("/collections")
      },
    })
  )
  const handleDeleteCollection = () => {
    if (!collection) return
    deleteCollection.mutate({ id: collection.id })
  }

  const collectionTypeOptions = [
    { label: "General", icon: <ListChecksIcon /> },
    { label: "TMDB", icon: <TvIcon /> },
  ] as const
  const [collectionType, setCollectionType] =
    useState<(typeof collectionTypeOptions)[number]["label"]>("TMDB")

  if (isLoading || isError) {
    return (
      <LoadingAndRetry
        isLoading={isLoading}
        isError={isError}
        retry={() => void refetch()}
      />
    )
  }

  if (!collection) {
    notFound()
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Link href="/collections">
          <Button variant={"secondary"} className="w-fit">
            <ArrowBigLeft />
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline">
                <EllipsisIcon />
              </Button>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <CogIcon />
                  Settings
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Collection Type</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={collectionType}
                        onValueChange={(value) =>
                          setCollectionType(
                            collectionTypeOptions.find((o) => o.label === value)
                              ?.label ?? "General"
                          )
                        }
                      >
                        {collectionTypeOptions.map((option) => (
                          <DropdownMenuRadioItem
                            value={option.label}
                            onSelect={() => setCollectionType(option.label)}
                            key={option.label}
                          >
                            {option.icon}
                            {option.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={handleDeleteCollection}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-xl p-4">
        <div className="flex items-center gap-2">
          {/* <ProgressBadge
            progress={calculateProgress({
              completed: collection.tasks.filter((t) => t.complete).length,
              total: collection.tasks.length,
            })}
            icon={<FilmIcon />}
          /> */}
          <h3 className="w-full">
            <InlineEditableInput
              value={name}
              onChange={setName}
              onBlur={handleCollectionUpdate}
            />
          </h3>
        </div>

        <div className="text-muted-foreground">
          <InlineEditableInput
            value={description}
            onChange={setDescription}
            onBlur={handleCollectionUpdate}
          />
        </div>
      </div>

      <div className="rounded-xl p-4">
        <div className="mb-2 flex items-center justify-between">
          <h5>Tasks</h5>
          <Badge variant="secondary">
            {collection.tasks.filter((t) => t.complete).length}/
            {collection.tasks.length} tasks
          </Badge>
        </div>
        <AnimatePresence>
          {collection.tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                delayChildren: 0.2,
              }}
            >
              {/* {collectionType === "TMDB" ? ( */}
              {/* <MediaCard task={task} /> */}
              {/* ) : ( */}
              <TaskDetailsDialog
                collectionId={collection.id}
                taskIdToEdit={task.id}
              />
              {/* )} */}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="rounded-xl p-4">
        <TaskDetailsDialog collectionId={collection.id} taskIdToEdit={null} />
      </div>
    </Container>
  )
}
