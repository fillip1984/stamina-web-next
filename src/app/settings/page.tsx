"use client"

import Container from "@/components/styled-components/container"
import Header from "@/components/styled-components/header"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import type { CollectionSummaryType, TaskType } from "@/server/api/types"
import { useTRPC } from "@/trpc/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CloudDownloadIcon, CloudUploadIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { ChangeEvent } from "react"
import { useEffect, useRef, useState } from "react"

import scaleIcon from "@/../public/icons/scale-weight.svg"

export default function PreferencesPage() {
  return (
    <Container>
      <Header>
        <h4>Settings</h4>
      </Header>

      <div className="flex w-full flex-col gap-4">
        <ImportExportSection />
        <WeightGoalsSection />
      </div>
    </Container>
  )
}

const ImportExportSection = () => {
  const router = useRouter()

  // export/import data stuff
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const exportData = useMutation(
    trpc.admin.exportData.mutationOptions({
      onSuccess: (data) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([JSON.stringify(data)]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute(
          "download",
          `${new Date().toLocaleString()} stamina_backup.json`
        )

        // Append to html link element page
        document.body.appendChild(link)

        // Start download
        link.click()

        // Clean up and remove the link
        link.parentNode?.removeChild(link)
      },
    })
  )

  const importData = useMutation(
    trpc.admin.importData.mutationOptions({
      onSuccess: () => {
        // toast.success("Vendor file uploaded", {
        //   duration: 4000,
        //   position: "top-center",
        // });
        void queryClient.invalidateQueries(
          trpc.collection.readAll.queryFilter()
        )
        void queryClient.invalidateQueries(trpc.tag.findAll.queryFilter())
        void router.push("/")
      },
    })
  )

  // const { mutate: importData } = api.admin.importData.useMutation({
  //   onSuccess: () => {
  //     // toast.success("Vendor file uploaded", {
  //     //   duration: 4000,
  //     //   position: "top-center",
  //     // });
  //     void utils.measurable.invalidate();
  //     void utils.area.invalidate();
  //     void router.push("/");
  //   },
  // });

  const fileInputRef = useRef<HTMLInputElement>(null)
  const triggerFileBrowse = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => processFile(file))
    }
  }

  const processFile = (file: File) => {
    try {
      const fr = new FileReader()
      fr.onload = convertFileToDataUrl
      fr.readAsDataURL(file)
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const convertFileToDataUrl = (e: ProgressEvent<FileReader>) => {
    const dataUrlString = e.target?.result
    const dataUrl = dataUrlString as string
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = dataUrl.split(",")[1]!
    const buffer = Buffer.from(data, "base64")
    const string = buffer.toString()
    const json = JSON.parse(string) as {
      collections: CollectionSummaryType[]
      tasks: TaskType[]
    }
    const collections = json.collections
    const tasks = json.tasks.map((task) => ({
      ...task,
      setDate: new Date(task.setDate),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      interval: task.interval ?? undefined,
    }))

    void importData.mutateAsync({ collections, tasks })
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h5>Import/Export</h5>
      <p>Manage your data import and export settings.</p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={triggerFileBrowse}>
          Import Data <CloudUploadIcon />
        </Button>
        <Button variant="outline" onClick={() => exportData.mutateAsync()}>
          Export Data <CloudDownloadIcon />
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        multiple={true}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

const WeightGoalsSection = () => {
  const [weightGoal, setWeightGoal] = useState("")

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const existingWeightGoal = useQuery(trpc.weighIn.getWeightGoal.queryOptions())

  // const { data: existingWeightGoal } = api.weighIn.getWeightGoal.useQuery();
  useEffect(() => {
    if (existingWeightGoal.data?.weight) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWeightGoal(existingWeightGoal.data.weight.toString())
    }
  }, [existingWeightGoal])

  const updateWeightGoal = useMutation(
    trpc.weighIn.setWeightGoal.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(
          trpc.weighIn.getWeightGoal.queryFilter()
        )
      },
    })
  )

  // const { mutate: setWeightGoalMutate } = api.weighIn.setWeightGoal.useMutation(
  //   {
  //     onSuccess: () => {
  //       void utils.weighIn.invalidate();
  //     },
  //   },
  // );

  return (
    <div className="flex w-full flex-col gap-2">
      <h5>Weight Goals</h5>
      <p>Set and track your weight goals.</p>
      <InputGroup className="w-40">
        <InputGroupAddon>
          <Image src={scaleIcon} alt="Weight" width={24} height={24} />
        </InputGroupAddon>
        <InputGroupInput
          value={weightGoal}
          onChange={(e) => setWeightGoal(e.target.value)}
          placeholder="180.2"
          onBlur={() => {
            if (weightGoal.trim() === "") {
              updateWeightGoal.mutate({ weightGoal: null })
            } else {
              const weight = parseFloat(weightGoal)
              if (!isNaN(weight)) {
                updateWeightGoal.mutate({ weightGoal: weight })
              }
            }
          }}
        />
        <InputGroupAddon align="inline-end">lbs</InputGroupAddon>
      </InputGroup>
    </div>
  )
}
