"use client"

import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import type { CollectionDetailType } from "@/server/api/types"
import { useTRPC } from "@/trpc/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function DeleteCollectionConfirmation({
  collection,
  open,
  close,
}: {
  collection: CollectionDetailType
  open: boolean
  close: () => void
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const router = useRouter()
  const deleteCollection = useMutation(
    trpc.collection.delete.mutationOptions({
      onSuccess: async () => {
        void queryClient.invalidateQueries(trpc.collection.pathFilter())
        router.replace("/collections")
      },
    })
  )
  const handleDeleteCollection = async () => {
    // use shadcn alert-dialog to get confirmation and delete on confirmation
    await deleteCollection.mutateAsync({ id: collection.id })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete collection?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete '${collection.name}' collection, including all tasks.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            disabled={deleteCollection.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteCollection}
            disabled={deleteCollection.isPending}
          >
            {deleteCollection.isPending ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
