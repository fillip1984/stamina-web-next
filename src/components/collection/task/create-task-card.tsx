"use client"

import { Button } from "@/components/ui/button"
import type { TaskType } from "@/server/api/types"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import TaskDetailsDialog from "./task-details-dialog"

export default function CreateTaskCard({
  collectionId,
}: {
  collectionId: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [task] = useState<TaskType>({
    id: "new",
    collectionId,
    name: "",
    description: "",
    setDate: new Date(),
    complete: false,
    interval: null,
    position: 0,
    dueDate: null,
    onComplete: null,
    priority: null,
    status: "Todo",
    suggestedDay: null,
    suggestedDayTime: null,
    type: "Todo" as TaskType["type"],
  })
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="h-20 gap-2 text-xl font-bold text-primary hover:bg-primary/10 hover:text-primary/80"
      >
        <PlusIcon className="size-10" />
        Add Task
      </Button>
      <TaskDetailsDialog
        task={task}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      />
    </>
  )
}
