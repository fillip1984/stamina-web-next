"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTRPC } from "@/trpc/react"

export default function CreateTask({ collectionId }: { collectionId: string }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.collection.pathFilter())
        void queryClient.invalidateQueries(trpc.task.pathFilter())
      },
    })
  )
  const handleCreateTask = () => {
    createTask.mutate({
      collectionId,
      name,
      description,
    })
    setName("")
    setDescription("")
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New task..."
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task details..."
      />
      <Button onClick={handleCreateTask} disabled={name.trim().length === 0}>
        Add Task
      </Button>
    </div>
  )
}
