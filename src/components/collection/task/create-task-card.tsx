"use client"

import { Button } from "@/components/ui/button"
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
      <Button onClick={() => setIsOpen(true)}>+ Add Task</Button>
      <TaskDetailsDialog
        collectionId={collectionId}
        taskIdToEdit={null}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      />
    </>
  )
}
