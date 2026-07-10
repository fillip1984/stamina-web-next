"use client"

import { useTRPC } from "@/trpc/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function CreateCollection() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const createCollection = useMutation(
    trpc.collection.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.collection.pathFilter())
      },
    })
  )
  const handleCreateCollection = () => {
    try {
      console.log(
        "Creating collection with name:",
        name,
        "and description:",
        description
      )
      createCollection.mutate({
        name,
        description,
      })
      setName("")
      setDescription("")
    } catch (error) {
      console.error("Error creating collection:", error)
    }
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={
            <Button className="flex h-40 w-80 flex-col items-center justify-center rounded-xl border p-4">
              New Collection
              <PlusIcon />
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button onClick={handleCreateCollection}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
