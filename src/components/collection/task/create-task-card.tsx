"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import TaskDetailsDialog from "./task-details-dialog"

export default function CreateTaskCard({
  collectionId,
}: {
  collectionId: string
}) {
  const [isOpen, setIsOpen] = useState(false)

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
        collectionId={collectionId}
        taskIdToEdit={null}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      />
    </>
  )
}
