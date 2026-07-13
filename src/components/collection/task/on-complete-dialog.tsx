"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { TaskType } from "@/server/api/types"
import { useTRPC } from "@/trpc/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  BicepsFlexedIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  HeartIcon,
  HeartOffIcon,
  HeartPulseIcon,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import scaleIcon from "@/../public/icons/scale-weight.svg"

export default function OnCompleteModal({
  task,
  dismiss,
}: {
  task: TaskType
  dismiss: () => void
}) {
  if ("Weigh In" === task.onComplete) {
    return <WeighIn task={task} dismiss={dismiss} />
  } else if ("Blood Pressure Reading" === task.onComplete) {
    return <BloodPressureReading task={task} dismiss={dismiss} />
  } else {
    return null
  }
}

const WeighIn = ({
  task,
  dismiss,
}: {
  task: TaskType
  dismiss: () => void
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const [weight, setWeight] = useState("")
  const [bodyFatPercentage, setBodyFatPercentage] = useState("")

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const completeWeighIn = useMutation(
    trpc.task.complete.mutationOptions({
      onSuccess: async () => {
        // await queryClient.invalidateQueries(trpc.task.findAll.queryFilter())
        await queryClient.invalidateQueries(trpc.result.findAll.queryFilter())
        dismiss()
      },
    })
  )
  // const utils = api.useUtils();
  // const { mutate: completeWeighIn } = api.task.complete.useMutation({
  //   onSuccess: async () => {
  //     await utils.task.findAll.invalidate();
  //     await utils.result.findAll.invalidate();
  //     dismiss();
  //   },
  // });

  const handleSaveWeighIn = () => {
    void completeWeighIn.mutateAsync({
      id: task.id,
      weighIn: {
        date,
        weight: parseFloat(weight),
        bodyFatPercentage: bodyFatPercentage
          ? parseFloat(bodyFatPercentage)
          : undefined,
      },
    })
  }

  return (
    <Dialog open={true} onOpenChange={dismiss}>
      <DialogContent className="grid w-fit gap-4">
        <DialogHeader>
          <DialogTitle>Weigh in</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger
              render={
                <InputGroup className="w-40">
                  <InputGroupAddon>
                    <CalendarDaysIcon />
                  </InputGroupAddon>
                  <Button variant="ghost">
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </InputGroup>
              }
            ></PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date ?? new Date())
                  setDatePickerOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>

          <InputGroup className="w-40">
            <InputGroupAddon>
              <Image
                src={scaleIcon}
                alt="Weight Scale"
                width={20}
                height={20}
              />
            </InputGroupAddon>
            <InputGroupInput
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="180.2"
            />
            <InputGroupAddon align="inline-end">lbs</InputGroupAddon>
          </InputGroup>

          <InputGroup className="w-40">
            <InputGroupAddon>
              <BicepsFlexedIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={bodyFatPercentage}
              onChange={(e) => setBodyFatPercentage(e.target.value)}
              placeholder="14.8"
            />
            <InputGroupAddon align="inline-end">%</InputGroupAddon>
          </InputGroup>
        </div>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant={"outline"} onClick={dismiss}>
                Cancel
              </Button>
            }
          ></DialogClose>
          <Button onClick={handleSaveWeighIn} disabled={!weight}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const BloodPressureReading = ({
  task,
  dismiss,
}: {
  task: TaskType
  dismiss: () => void
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")
  const [heartRate, setHeartRate] = useState("")

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const completeBloodPressure = useMutation(
    trpc.task.complete.mutationOptions({
      onSuccess: async () => {
        // await queryClient.invalidateQueries(trpc.task.read.queryFilter())
        await queryClient.invalidateQueries(trpc.result.findAll.queryFilter())
        dismiss()
      },
    })
  )

  const handleSaveBloodPressure = async () => {
    await completeBloodPressure.mutateAsync({
      id: task.id,
      bloodPressureReading: {
        date,
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        pulse: heartRate ? parseInt(heartRate) : undefined,
      },
    })
  }

  return (
    <Dialog open={true} onOpenChange={dismiss}>
      <DialogContent className="grid w-72 gap-4">
        <DialogHeader>
          <DialogTitle>Blood Pressure Reading</DialogTitle>
        </DialogHeader>
        <div className="grid justify-center gap-3">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger
              render={
                <InputGroup>
                  <InputGroupAddon>
                    <CalendarDaysIcon />
                  </InputGroupAddon>
                  <Button variant="ghost">
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </InputGroup>
              }
            ></PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date ?? new Date())
                  setDatePickerOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="grid gap-2">
            <Label htmlFor="systolic">Systolic</Label>
            <InputGroup>
              <InputGroupAddon>
                <HeartOffIcon />
                {/* <AiFillHeart /> */}
              </InputGroupAddon>
              <InputGroupInput
                id="systolic"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="120"
              />
              <InputGroupAddon align="inline-end">mmHg</InputGroupAddon>
            </InputGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="diastolic">Diastolic</Label>
            <InputGroup>
              <InputGroupAddon>
                <HeartIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="diastolic"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="80"
              />
              <InputGroupAddon align="inline-end">mmHg</InputGroupAddon>
            </InputGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="heartRate">Heart Rate</Label>
            <InputGroup>
              <InputGroupAddon>
                <HeartPulseIcon />
                {/* <BsHeartPulseFill /> */}
              </InputGroupAddon>
              <InputGroupInput
                id="heartRate"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="70"
              />
              <InputGroupAddon align="inline-end">bpm</InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <DialogFooter className="mt-8 flex flex-row">
          <DialogClose
            render={<Button variant={"secondary"}>Cancel</Button>}
          ></DialogClose>
          <Button
            onClick={handleSaveBloodPressure}
            disabled={!systolic || !diastolic}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
