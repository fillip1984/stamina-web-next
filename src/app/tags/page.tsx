"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState, type SubmitEvent } from "react"

import LoadingAndRetry from "@/components/shared/loading-and-retry"
import Container from "@/components/styled-components/container"
import Header, { HeaderActions } from "@/components/styled-components/header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { TagType } from "@/server/api/types"
import { useTRPC } from "@/trpc/react"
import {
  BeerIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"

export default function TagPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [editableItem, setEditableItem] = useState<TagType | null>(null)
  const trpc = useTRPC()
  const {
    data: tags,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.tag.findAll.queryOptions())

  if (isLoading || isError) {
    return (
      <LoadingAndRetry
        isLoading={isLoading}
        isError={isError}
        retry={() => void refetch()}
      />
    )
  }

  return (
    <>
      <Container scrollToTopButton={true}>
        <Header>
          <h4>Tags</h4>
          <HeaderActions>
            <Button onClick={() => setIsOpen(true)} size={"icon"}>
              <PlusIcon />
            </Button>
          </HeaderActions>
        </Header>

        <div className="flex w-full flex-col gap-2">
          <AnimatePresence>
            {tags?.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  delayChildren: 0.2,
                }}
              >
                <TagCard
                  tag={tag}
                  edit={() => {
                    setEditableItem(tag)
                    setIsOpen(true)
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {tags?.length === 0 && (
          <EmptyView createNewAction={() => setIsOpen(true)} />
        )}
      </Container>

      <TagModal
        open={isOpen}
        close={() => setIsOpen(false)}
        editableItem={editableItem}
      />
    </>
  )
}

const TagCard = ({ tag, edit }: { tag: TagType; edit: () => void }) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  // const { mutateAsync: deleteTag } = api.tag.delete.useMutation({
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries(trpc.tag.pathFilter());
  //   },
  // });
  const deleteTag = useMutation(
    trpc.tag.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tag.pathFilter())
      },
    })
  )

  return (
    <Item variant="outline" className="flex w-full grow bg-card">
      <ItemContent>
        <ItemTitle>{tag.name}</ItemTitle>
        <ItemDescription>{tag.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        {/* <Button variant="outline" size="sm">
          Action
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm">
                <EllipsisVerticalIcon />
              </Button>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={edit}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem>
                <EyeIcon />
                View Activity
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => deleteTag.mutateAsync({ id: tag.id })}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  )
}

const TagModal = ({
  open,
  close,
  editableItem,
}: {
  open: boolean
  close: () => void
  editableItem: TagType | null
}) => {
  const [mode, setMode] = useState<"Create" | "Update">("Create")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // IX: init form state
  useEffect(() => {
    if (editableItem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editableItem.name)
      setDescription(editableItem.description)
      setMode("Update")
    } else {
      setName("")
      setDescription("")
      setMode("Create")
    }
  }, [editableItem])

  // UX: form validation
  const [isValid, setIsValid] = useState(false)
  const validateForm = () => {
    if (name.trim() === "") return false
    if (description.trim() === "") return false
    return true
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsValid(validateForm())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description])

  // MX: create/update tag
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const createTag = useMutation(
    trpc.tag.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tag.pathFilter())
        close()
      },
    })
  )
  const updateTag = useMutation(
    trpc.tag.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tag.pathFilter())
        close()
      },
    })
  )

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValid) return

    if (editableItem && mode === "Update") {
      await updateTag.mutateAsync({
        ...editableItem,
        name: name.trim(),
        description: description.trim(),
      })
    } else {
      await createTag.mutateAsync({
        name: name.trim(),
        description: description.trim(),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode} tag</DialogTitle>
          <DialogDescription>
            {mode} tag, tags are used to categorize your items.
          </DialogDescription>
        </DialogHeader>
        <form id="tag-form" onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tag name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tag description"
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant={"outline"} onClick={close}>
                Cancel
              </Button>
            }
          ></DialogClose>
          <Button
            type="submit"
            form="tag-form"
            disabled={!isValid || createTag.isPending || updateTag.isPending}
          >
            {createTag.isPending || updateTag.isPending ? <Spinner /> : mode}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const EmptyView = ({ createNewAction }: { createNewAction: () => void }) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BeerIcon />
        </EmptyMedia>
        <EmptyTitle>Nothing to show yet</EmptyTitle>
        <EmptyDescription>
          Try clicking some of the buttons to get started...
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={createNewAction}>Create</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
