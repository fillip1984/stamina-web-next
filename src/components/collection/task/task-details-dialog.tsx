"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ListChecksIcon,
  RepeatIcon,
  Tally5Icon,
  TelescopeIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

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
import { Spinner } from "@/components/ui/spinner"

import {
  DayOfWeekEnumValues,
  DaytimeEnumValues,
  OnCompleteEnumValues,
  type DayOfWeekEnumType,
  type DaytimeEnumType,
  type OnCompleteEnumType,
  type TaskTypeEnumType,
} from "@/client/enums"
import StyledDatePicker from "@/components/styled-components/styled-date-picker"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { TaskType } from "@/server/api/types"
import { useTRPC } from "@/trpc/react"
import { nextDay, type Day } from "date-fns"
import { AnimatePresence, motion } from "motion/react"

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
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<TaskTypeEnumType>("Todo")
  const [suggestedDayTime, setSuggestedDayTime] =
    useState<DaytimeEnumType | null>(null)
  const [suggestedDay, setSuggestedDay] = useState<DayOfWeekEnumType | null>(
    null
  )
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [interval, setInterval] = useState<number>()
  const [onComplete, setOnComplete] = useState<OnCompleteEnumType | null>(null)

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
        type,
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
    setType("Todo")
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
    if (type === "Recurring" && !dueDate) return false

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
      setType("Todo")
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
      setOnComplete(task.onComplete)
      setMode("Update")
    }
  }, [task])

  // UX: set dueDate to next instance of suggestedDay when it is selected
  useEffect(() => {
    if (type !== "Recurring") return
    if (!suggestedDay) return
    // only update if changed
    if (task.suggestedDay === suggestedDay) return

    const today = new Date()
    const todayDayOfWeek = today.getDay() // 0 (Sun) - 6 (Sat)
    const targetDayOfWeek = Object.values(DayOfWeekEnumValues).findIndex(
      (d) => d === suggestedDay
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

  const taskTypeOptions: {
    label: string
    icon: React.ReactElement
    description: string
  }[] = [
    {
      label: "Todo",
      icon: <ListChecksIcon />,
      description: "A task that can be completed a single time.",
    },
    {
      label: "Recurring",
      icon: <RepeatIcon />,
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
        <form className="-mx-4 mt-0 flex flex-col gap-2 overflow-y-auto px-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">
                Description
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="onComplete">
                On Complete Action
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Combobox
                items={Object.values(OnCompleteEnumValues)}
                value={onComplete}
                onValueChange={(item) => setOnComplete(item)}
              >
                <ComboboxInput showClear />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>
          <FieldGroup className="w-full">
            <FieldSet>
              <FieldLegend variant="label">Task Type</FieldLegend>
              <RadioGroup
                className="flex"
                value={type}
                onValueChange={(value) => setType(value)}
              >
                {taskTypeOptions.map((t) => (
                  <FieldLabel key={t.label} htmlFor={t.label}>
                    <Field>
                      <FieldContent className="flex h-20 w-20 flex-col items-center justify-center gap-3">
                        <span>{t.icon}</span>
                        <span
                          className={`text-xs text-muted-foreground ${type === (t.label as TaskTypeEnumType) ? "text-primary" : ""}`}
                        >
                          {t.label}
                        </span>
                      </FieldContent>
                      <RadioGroupItem hidden value={t.label} id={t.label} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              <FieldLegend className="text-center text-sm text-muted-foreground">
                {type &&
                  taskTypeOptions.find(
                    (mt) => (mt.label as TaskTypeEnumType) === type
                  )?.description}
              </FieldLegend>
            </FieldSet>
          </FieldGroup>
          <AnimatePresence initial={false}>
            {type === "Recurring" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="grid gap-3"
              >
                <FieldGroup className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="suggestedDay">
                      Suggested Day
                    </FieldLabel>
                    <Combobox
                      id="suggestedDay"
                      value={suggestedDay}
                      onValueChange={(value) => setSuggestedDay(value)}
                      items={Object.values(DayOfWeekEnumValues)}
                    >
                      <ComboboxInput showClear />
                      <ComboboxContent>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="suggestedDayTime">
                      Suggested Day Time
                    </FieldLabel>
                    <Combobox
                      id="suggestedDayTime"
                      value={suggestedDayTime}
                      onValueChange={(value) => setSuggestedDayTime(value)}
                      items={Object.values(DaytimeEnumValues)}
                    >
                      <ComboboxInput showClear />
                      <ComboboxContent>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>
                </FieldGroup>

                <FieldGroup className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                    <StyledDatePicker
                      id="dueDate"
                      value={dueDate}
                      handleOnChange={(e) => setDueDate(e)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="interval">
                      Interval
                      <span className="text-sm text-muted-foreground">
                        (days)
                      </span>
                    </FieldLabel>
                    <Input
                      id="interval"
                      type="number"
                      value={interval}
                      onChange={(e) => setInterval(Number(e.target.value))}
                      placeholder="days"
                    />
                  </Field>
                </FieldGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
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
            {createTask.isPending || updateTask.isPending ? <Spinner /> : mode}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
