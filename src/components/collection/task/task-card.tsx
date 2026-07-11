"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash } from "lucide-react"
import { useState } from "react"

import TextFieldEditInPlace from "@/components/styled-components/inline-editable-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { TaskType } from "@/server/api/types"
import { useTRPC } from "@/trpc/react"

export default function TaskCard({ task }: { task: TaskType }) {
  const [name, setName] = useState(task.name)
  const [description, setDescription] = useState(task.description ?? "")
  const [complete, setComplete] = useState(task.complete)

  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const updateTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.collection.pathFilter())
      },
    })
  )
  const handleTaskUpdate = () => {
    // only update if changes were made
    console.log("handleTaskUpdate", {
      name,
      nameEqual: name === task.name,
      description,
      descriptionEqual: description === task.description,
      complete,
      completeEqual: complete === task.complete,
    })
    if (
      name !== task.name ||
      description !== task.description ||
      complete !== task.complete
    ) {
      updateTask.mutate({ ...task, name, description, complete })
    }
  }
  const handleComplete = () => {
    const newState = !complete
    setComplete(newState)
    updateTask.mutate({
      ...task,
      complete: newState,
    })
  }

  const deleteTask = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.collection.pathFilter())
      },
    })
  )
  const handleDeleteTask = () => {
    deleteTask.mutate({ id: task.id })
  }
  return (
    <div className="flex items-center gap-2 border-b py-2">
      <Checkbox
        checked={complete}
        onCheckedChange={handleComplete}
        className="h-6 w-6"
      />
      <div className="w-full">
        <div className={`font-semibold ${complete ? "line-through" : ""}`}>
          <TextFieldEditInPlace
            value={name}
            onChange={setName}
            onBlur={handleTaskUpdate}
            className="min-h-0"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          <TextFieldEditInPlace
            value={description}
            onChange={setDescription}
            onBlur={handleTaskUpdate}
          />
        </div>
      </div>
      <Button variant="destructive" size="icon" onClick={handleDeleteTask}>
        <Trash />
      </Button>
    </div>
  )
}
