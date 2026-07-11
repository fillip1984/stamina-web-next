"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { motion } from "motion/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { calculateTaskProgress } from "@/lib/task-utils"
import type { TaskType } from "@/server/api/types"
import { useTRPC } from "@/trpc/react"

import {
  CheckIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TargetIcon,
  TrashIcon,
} from "lucide-react"

export default function TaskCard({ task }: { task: TaskType }) {
  // const { isOpen, show, hide } = useModal()
  const [isOnCompleteOpen, setIsOnCompleteOpen] = useState(false)

  // const [isExpanded, setIsExpanded] = useState(false);
  const { daysRemaining, progress, overdue, elapsedDays } =
    calculateTaskProgress(task.setDate, task.dueDate ?? undefined)

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const completeTask = useMutation(
    trpc.task.complete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.collection.readAll.queryFilter()
        )
        await queryClient.invalidateQueries(trpc.result.findAll.queryFilter())
      },
    })
  )
  const deleteTask = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.collection.readAll.queryFilter()
        )
      },
    })
  )

  // const { mutateAsync: completeTask } =
  //   api.task.complete.useMutation({
  //     onSuccess: async () => {
  //       await utils.task.findAll.invalidate();
  //       await utils.result.findAll.invalidate();
  //     },
  //   });
  // const { mutateAsync: deleteTask } = api.task.delete.useMutation({
  //   onSuccess: async () => {
  //     await utils.task.findAll.invalidate();
  //   },
  // });

  const handleComplete = async () => {
    if (task.onComplete) {
      setIsOnCompleteOpen(true)
    } else {
      await completeTask.mutateAsync({ id: task.id })
    }
  }

  // const { setTaskIdToEdit } = useContext(AppContext)
  // const handleEdit = () => {
  //   setTaskIdToEdit(task.id)
  // }

  return (
    <>
      <Item
        variant="outline"
        className="relative w-full items-start bg-card p-2"
      >
        <ItemContent
          // onClick={() => setIsExpanded((prev) => !prev)}
          className="cursor-pointer gap-0"
        >
          <ItemTitle>
            {task.name}
            {/* <Badge variant={"secondary"}>{task.areaName}</Badge> */}
          </ItemTitle>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {task.description}
          </span>
          <div className="relative my-2 flex h-8 w-full items-center justify-center overflow-hidden rounded-2xl border">
            {/* render prgress label for count down mode */}
            {task.dueDate && (
              <div className="z-30 flex items-center gap-1">
                <span className="text-xl font-bold">
                  {daysRemaining > 0 ? daysRemaining : daysRemaining * -1}
                </span>
                <span className="text-xs">
                  {daysRemaining > 0 ? "days remaining" : "days overdue"}
                </span>
                <span className="ml-4 flex items-center gap-1 text-xs">
                  <TargetIcon className="text-xl" />
                  {format(task.dueDate, "MMM do")}
                </span>
              </div>
            )}

            {/* render prgress label for tally and seeking modes */}
            {("Tally" === task.type || "Seeking" === task.type) && (
              <div className="z-30 flex items-center gap-1">
                <span className="text-xl font-bold">
                  {elapsedDays > 0 ? elapsedDays : 0}
                </span>
                {"Tally" === task.type ? (
                  <span className="text-xs">days and counting</span>
                ) : (
                  <span className="text-xs">days since</span>
                )}
              </div>
            )}

            {/* progress bar fill animations */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.3,
                type: "spring",
                bounce: progress > 100 && progress < 0 ? 0 : 0.3,
              }}
              className="absolute inset-0 z-10 bg-blue-600/80"
            ></motion.div>
            {overdue && (
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress - 100}%` }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  type: "spring",
                  bounce: progress > 100 ? 0 : 0.3,
                }}
                className="absolute inset-0 z-20 bg-red-600/80"
                style={{
                  width: `
          ${progress - 100}%
          `,
                }}
              ></motion.div>
            )}
          </div>
          {/* <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex flex-col gap-1 py-1"
              >
                <span className="flex items-center gap-1">
                  <FaCalendarWeek />
                  {task.setDate.toLocaleDateString()} -{" "}
                  {task.dueDate
                    ? task.dueDate.toLocaleDateString()
                    : task.type === "Seeking"
                      ? "Seeking"
                      : "Open ended"}
                </span>
                <span className="flex items-center gap-1">
                  <GiDuration />
                  {task.type === "Countdown"
                    ? `${interval} days`
                    : "No interval set"}
                </span>
              </motion.div>
            )}
          </AnimatePresence> */}
        </ItemContent>
        <ItemActions className="flex flex-col">
          <Button
            variant="outline"
            size="sm"
            onClick={handleComplete}
            className="flex flex-col items-center gap-0"
          >
            <div>
              <CheckIcon />
            </div>
          </Button>
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
                <DropdownMenuItem
                // onClick={handleEdit}
                >
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
                  // onClick={() => deleteTask.mutateAsync(task.id)}
                >
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>

      {/* {isOnCompleteOpen && <OnCompleteModal task={task} dismiss={hide} />} */}
    </>
  )
}
