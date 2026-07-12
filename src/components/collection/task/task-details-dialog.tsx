"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Day } from "date-fns"
import { nextDay } from "date-fns"
import {
  ChevronDownIcon,
  HourglassIcon,
  ListChecksIcon,
  Tally5Icon,
  TelescopeIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import Combobox from "@/components/styled-components/combobox"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import type { TaskType } from "@/server/api/types"
import type {
  DayOfWeekEnum,
  DaytimeEnum,
  OnCompleteEnum,
  TaskEnum,
} from "@/server/db/schema"
import { useTRPC } from "@/trpc/react"

// type DaytimeEnum = (typeof daytimeEnum.enumValues)[number];

export default function TaskDetailsDialog({
  task,
  isOpen,
  close,
}: {
  task: TaskType
  isOpen: boolean
  close: () => void
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.collection.pathFilter())
        close()
      },
    })
  )

  const updateTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.collection.pathFilter())
        close()
      },
    })
  )

  const [mode, setMode] = useState<"Create" | "Update">("Create")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<TaskEnum>("Todo" as TaskEnum)
  const [suggestedDayTime, setSuggestedDayTime] = useState<DaytimeEnum | null>(
    null
  )
  const [suggestedDay, setSuggestedDay] = useState<DayOfWeekEnum | null>(null)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [interval, setInterval] = useState<number>()
  const [onComplete, setOnComplete] = useState<OnCompleteEnum | null>(null)

  const handleCreateOrUpdate = async () => {
    if (mode === "Update") {
      await updateTask.mutateAsync({
        id: task.id,
        name,
        description,
        type,
        suggestedDay: suggestedDay,
        suggestedDayTime: suggestedDayTime,
        dueDate: dueDate,
        interval,
        onComplete,
        complete: task.complete,
        collectionId: task.collectionId,
      })
    } else {
      await createTask.mutateAsync({
        name,
        description,
        setDate: new Date(),
        type: type as TaskEnum,
        suggestedDay,
        suggestedDayTime,
        dueDate,
        interval,
        onComplete,
        collectionId: task.collectionId,
      })
    }
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setType("Todo" as TaskEnum)
    setSuggestedDayTime(null)
    setSuggestedDay(null)
    setDueDate(null)
    setInterval(undefined)
    setOnComplete(null)
    setMode("Create")
  }

  const [validToCreate, setValidToCreate] = useState(false)
  const validateForm = () => {
    if (name.trim().length === 0) return false
    if (type === ("Countdown" as TaskEnum) && !dueDate) return false

    return true
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValidToCreate(validateForm())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description, type, dueDate])

  // UX: when editing, populate fields or set defaults when creating new
  useEffect(() => {
    if (task.id === "new") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("Create")
      setName("")
      setDescription("")
      setType("Todo" as TaskEnum)
      setSuggestedDayTime(null)
      setSuggestedDay(null)
      setDueDate(null)
      setInterval(undefined)
      setOnComplete(null)
    } else {
      setMode("Update")
      setName(task.name)
      setDescription(task.description ?? "")
      setType(task.type)
      setSuggestedDay(task.suggestedDay)
      setSuggestedDayTime(task.suggestedDayTime)
      setDueDate(task.dueDate)
      setInterval(task.interval ?? undefined)
      setOnComplete(task.onComplete ?? null)
      setMode("Update")
    }
  }, [task])

  const daysOfWeek = [
    { id: "Sunday", label: "Sunday" },
    { id: "Monday", label: "Monday" },
    { id: "Tuesday", label: "Tuesday" },
    { id: "Wednesday", label: "Wednesday" },
    { id: "Thursday", label: "Thursday" },
    { id: "Friday", label: "Friday" },
    { id: "Saturday", label: "Saturday" },
  ]

  // UX: set dueDate to next instance of suggestedDay when it is selected
  useEffect(() => {
    if (type !== ("Countdown" as TaskEnum)) return
    if (!suggestedDay) return
    // only update if changed
    if (task.suggestedDay === suggestedDay) return

    const today = new Date()
    const todayDayOfWeek = today.getDay() // 0 (Sun) - 6 (Sat)
    const targetDayOfWeek = daysOfWeek.findIndex(
      (d) => (d.label as DayOfWeekEnum) === suggestedDay
    )

    // if today, set today
    if (todayDayOfWeek === targetDayOfWeek) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDueDate(today)
    } else {
      const nextDate = nextDay(today, targetDayOfWeek as Day)
      setDueDate(nextDate)
    }

    // default interval to 7 days, if not set
    if (!interval) {
      setInterval(7)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedDay, type])

  const taskTypes = [
    {
      label: "Todo",
      icon: <ListChecksIcon />,
      description: "A task that can be completed a single time.",
    },
    {
      label: "Countdown",
      icon: <HourglassIcon />,
      description: "A task that counts down to a due date.",
    },
    {
      label: "Seeking",
      icon: <TelescopeIcon />,
      description:
        "A task that we don't know how long the interval should be, due date is set open ended until you complete and then the interval is set.",
    },
    {
      label: "Tally",
      icon: <Tally5Icon />,
      description: "A task that tallies up days since being set.",
    },
  ]

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close()
        }
      }}
    >
      <DialogContent className="h-3/4 w-full max-w-3/4 grid-rows-[auto_1fr_auto] sm:max-w-130 md:max-w-130 lg:max-w-130">
        <DialogHeader>
          <DialogTitle>{mode} Task</DialogTitle>
          <DialogDescription>
            {mode} task item, task items are used to track progress towards a
            goal.
          </DialogDescription>
        </DialogHeader>
        {/* TODO: look at refactoring with Field concepts */}
        <div className="-mx-4 mt-0 flex flex-col gap-2 overflow-y-auto px-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">
              Description
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* <div className="grid grid-cols-1 gap-2 sm:grid-cols-2"> */}
          {/* <div className="grid gap-2">
              <Label htmlFor="area">Area</Label>
              <Combobox
                id="area"
                value={area?.id ?? "Uncategorized"}
                setValue={(value) =>
                  setArea(areas?.find((a) => a.id === value) ?? null)
                }
                options={[
                  { id: "Uncategorized", label: "Uncategorized" },
                ].concat(
                  areas?.map((area) => ({ id: area.id, label: area.name })) ??
                    []
                )}
                placeholder="Select an area"
                className="w-52"
              />
            </div> */}
          {/* <div className="grid gap-2">
              <Label>Area Description</Label>
              <span className="text-sm text-muted-foreground">
                {area?.description ?? "Uncategorized"}
              </span>
            </div> */}
          {/* </div> */}
          <div className="grid gap-3">
            <Label htmlFor="onComplete">On Complete Action</Label>
            <Combobox
              id="onComplete"
              value={onComplete ?? "None"}
              setValue={(value) =>
                setOnComplete(
                  value === "None" ? null : (value as OnCompleteEnum)
                )
              }
              options={[
                { id: "None", label: "None" },
                // { id: "Note", label: "Note" },
                {
                  id: "Blood_pressure_reading",
                  label: "Blood pressure reading",
                },
                { id: "Weigh_in", label: "Weigh in" },
                // { id: "Runners_log", label: "Runners log" },
              ]}
              placeholder="Select an action"
              className="w-52"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <div className="flex flex-wrap justify-center gap-1">
              {taskTypes.map((t) => (
                <div
                  key={t.label}
                  onClick={() => setType(t.label as TaskEnum)}
                  className={`flex h-20 w-20 flex-col items-center justify-center gap-3 rounded-md select-none ${type === (t.label as TaskEnum) ? "border-2 border-primary bg-primary/5" : "border"} p-4`}
                >
                  <span>{t.icon}</span>
                  <span
                    className={`text-xs text-muted-foreground ${type === (t.label as TaskEnum) ? "text-primary" : ""}`}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
            <span className="h-10 text-sm text-muted-foreground">
              {
                taskTypes.find((mt) => (mt.label as TaskEnum) === type)
                  ?.description
              }
            </span>
          </div>
          <AnimatePresence initial={false}>
            {type === ("Countdown" as TaskEnum) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="grid gap-3"
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="suggestedDay">
                      Suggested Day
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Combobox
                      id="suggestedDay"
                      value={suggestedDay as string}
                      setValue={(value) =>
                        setSuggestedDay(value as DayOfWeekEnum | null)
                      }
                      options={daysOfWeek}
                      placeholder="Select a day"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="suggestedDayTime">
                      Suggest Day Time
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Combobox
                      id="suggestedDayTime"
                      value={suggestedDayTime as unknown as string}
                      setValue={(value) =>
                        setSuggestedDayTime(
                          value ? (value as unknown as DaytimeEnum) : null
                        )
                      }
                      options={[
                        { id: "Morning", label: "Morning" },
                        { id: "Afternoon", label: "Afternoon" },
                        { id: "Evening", label: "Evening" },
                        { id: "Night", label: "Night" },
                      ]}
                      placeholder="Select a time of day"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Due Date</Label>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            id="date"
                            className="w-48 justify-between font-normal"
                          >
                            {dueDate
                              ? dueDate.toLocaleDateString()
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        }
                      ></PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={dueDate ?? undefined}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDueDate(date ?? null)
                            setIsCalendarOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label>Interval</Label>
                    <Input
                      type="number"
                      value={interval}
                      onChange={(e) => setInterval(Number(e.target.value))}
                      placeholder="days"
                      // className="w-24"
                    />
                    {/*<span className="text-muted-foreground text-sm">
                      {interval
                        ? `Every ${interval} day${interval > 1 ? "s" : ""}`
                        : ""}
                    </span>*/}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={createTask.isPaused}>
                Cancel
              </Button>
            }
          ></DialogClose>
          <Button
            onClick={handleCreateOrUpdate}
            disabled={
              !validToCreate || createTask.isPending || updateTask.isPending
            }
          >
            {createTask.isPending || updateTask.isPending ? (
              <Spinner />
            ) : "Update" === mode ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
