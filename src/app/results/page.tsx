"use client"

import LoadingAndRetry from "@/components/shared/loading-and-retry"
import Container from "@/components/styled-components/container"
import Header from "@/components/styled-components/header"
import { Item, ItemContent, ItemMedia } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import type {
  BloodPressureReadingType,
  ResultType,
  WeighInType,
} from "@/server/api/types"
import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BicepsFlexedIcon,
  BriefcaseMedicalIcon,
  CalendarIcon,
  GoalIcon,
  HeartIcon,
  HeartPulseIcon,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import scaleIcon from "@/../public/icons/scale-weight.svg"

export default function ResultsPage() {
  const trpc = useTRPC()
  const {
    data: results,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.result.findAll.queryOptions())

  if (isLoading || isError) {
    return (
      <LoadingAndRetry
        isLoading={isLoading}
        isError={isError}
        retry={() => void refetch()}
      />
    )
  }

  return (
    <Container scrollToTopButton={true}>
      <Header>
        <h4>Results</h4>
      </Header>

      <div className="flex w-full flex-col gap-2">
        {results?.map((result) => (
          <Item key={result.id} variant={"outline"} className="bg-card">
            <ItemMedia className="flex flex-col">
              {result.bloodPressureReading ? (
                <HeartPulseIcon className="h-6 w-6" />
              ) : result.weighIn ? (
                <Image src={scaleIcon} alt="Weight" width={20} height={20} />
              ) : (
                <Trophy className="h-6 w-6" />
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon />
                {result.date.toLocaleDateString()}
              </div>
            </ItemMedia>
            <ItemContent className="h-full">
              {result.bloodPressureReading ? (
                <BloodPressureResult
                  bloodPressureReading={result.bloodPressureReading}
                />
              ) : result.weighIn ? (
                <WeighInResult weighIn={result.weighIn} />
              ) : (
                <NotesOnlyResult result={result} />
              )}
            </ItemContent>
          </Item>
        ))}
      </div>
    </Container>
  )
}

const WeighInResult = ({ weighIn }: { weighIn: WeighInType }) => {
  const trpc = useTRPC()
  const weightGoal = useQuery(trpc.weighIn.getWeightGoal.queryOptions())
  const lastWeighIn = useQuery(
    trpc.weighIn.readById.queryOptions(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { id: weighIn.previousWeighInId! },
      {
        enabled: !!weighIn.previousWeighInId,
      }
    )
  )

  const [weightTrendValue, setWeightTrendValue] = useState<number | null>(null)
  const [bodyFatTrendValue, setBodyFatTrendValue] = useState<number | null>(
    null
  )

  useEffect(() => {
    if (lastWeighIn.data) {
      const weightDiff = (weighIn.weight - lastWeighIn.data.weight).toFixed(2)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWeightTrendValue(Number(weightDiff))

      if (weighIn.bodyFatPercentage && lastWeighIn.data.bodyFatPercentage) {
        const bodyFatDiff = (
          weighIn.bodyFatPercentage - lastWeighIn.data.bodyFatPercentage
        ).toFixed(2)
        setBodyFatTrendValue(Number(bodyFatDiff))
      }
    }
  }, [lastWeighIn, weighIn])

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-flow-col">
      <StatCard
        title={
          <>
            <Image src={scaleIcon} alt="Weight" width={20} height={20} />
            weight
          </>
        }
        primaryValue={weighIn.weight}
        primaryFooter="lbs"
        trendValue={weightTrendValue ?? undefined}
        trendFooter={
          weightTrendValue === null ? undefined : weightTrendValue === 0 ? (
            <ArrowRightIcon />
          ) : weightTrendValue > 0 ? (
            <ArrowUpIcon />
          ) : (
            <ArrowDownIcon />
          )
        }
        trendDirection={
          weightTrendValue === null
            ? undefined
            : weightTrendValue === 0
              ? "neutral"
              : weightTrendValue > 0
                ? "up"
                : "down"
        }
      />
      <StatCard
        title={
          <>
            <BicepsFlexedIcon />
            body fat
          </>
        }
        primaryValue={weighIn.bodyFatPercentage ?? ""}
        primaryFooter="%"
        trendValue={bodyFatTrendValue ?? undefined}
        trendFooter={
          bodyFatTrendValue === null ? undefined : bodyFatTrendValue === 0 ? (
            <ArrowRightIcon />
          ) : bodyFatTrendValue > 0 ? (
            <ArrowUpIcon />
          ) : (
            <ArrowDownIcon />
          )
        }
        trendDirection={
          bodyFatTrendValue === null
            ? undefined
            : bodyFatTrendValue === 0
              ? "neutral"
              : bodyFatTrendValue > 0
                ? "up"
                : "down"
        }
      />
      {weightGoal.data?.weight && (
        <StatCard
          title={
            <>
              <GoalIcon className="text-yellow-300" />
              Goal
              <span className="text-sm lowercase">
                {weightGoal.data.weight} lbs
              </span>
            </>
          }
          primaryValue={
            weightGoal.data.weight
              ? (weighIn.weight - weightGoal.data.weight).toFixed(2)
              : "N/A"
          }
          primaryFooter="lbs to go"
        />
      )}
    </div>
  )
}

const BloodPressureResult = ({
  bloodPressureReading,
}: {
  bloodPressureReading: BloodPressureReadingType
}) => {
  const trpc = useTRPC()
  const lastBloodPressureReading = useQuery(
    trpc.bloodPressureReading.readById.queryOptions(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { id: bloodPressureReading.previousBloodPressureReadingId! },
      {
        enabled: !!bloodPressureReading.previousBloodPressureReadingId,
      }
    )
  )

  const [systolicTrendValue, setSystolicTrendValue] = useState<number | null>(
    null
  )
  const [diastolicTrendValue, setDiastolicTrendValue] = useState<number | null>(
    null
  )
  const [pulseTrendValue, setPulseTrendValue] = useState<number | null>(null)
  useEffect(() => {
    if (lastBloodPressureReading.data) {
      const systolicDiff = (
        bloodPressureReading.systolic - lastBloodPressureReading.data.systolic
      ).toFixed(2)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSystolicTrendValue(Number(systolicDiff))

      const diastolicDiff = (
        bloodPressureReading.diastolic - lastBloodPressureReading.data.diastolic
      ).toFixed(2)
      setDiastolicTrendValue(Number(diastolicDiff))

      if (
        bloodPressureReading.pulse !== null &&
        lastBloodPressureReading.data.pulse !== null
      ) {
        const pulseDiff = (
          bloodPressureReading.pulse - lastBloodPressureReading.data.pulse
        ).toFixed(2)
        setPulseTrendValue(Number(pulseDiff))
      }
    }
  }, [bloodPressureReading, lastBloodPressureReading])

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-flow-col">
      <StatCard
        title={
          <>
            <HeartIcon className="text-red-500" />
            systolic
          </>
        }
        primaryValue={bloodPressureReading.systolic}
        primaryFooter="mmHg"
        trendValue={systolicTrendValue ?? undefined}
        trendFooter={
          systolicTrendValue === null ? undefined : systolicTrendValue === 0 ? (
            <ArrowRightIcon />
          ) : systolicTrendValue > 0 ? (
            <ArrowUpIcon />
          ) : (
            <ArrowDownIcon />
          )
        }
        trendDirection={
          systolicTrendValue === null
            ? undefined
            : systolicTrendValue === 0
              ? "neutral"
              : systolicTrendValue > 0
                ? "up"
                : "down"
        }
      />
      <StatCard
        title={
          <>
            <HeartIcon className="text-red-500" />
            diastolic
          </>
        }
        primaryValue={bloodPressureReading.diastolic}
        primaryFooter="mmHg"
        trendValue={diastolicTrendValue ?? undefined}
        trendFooter={<ArrowDownIcon />}
        trendDirection="down"
      />
      <StatCard
        title={
          <>
            <HeartPulseIcon className="text-red-500" />
            pulse
          </>
        }
        primaryValue={bloodPressureReading.pulse ?? "N/A"}
        primaryFooter="bpm"
        trendValue={pulseTrendValue ?? undefined}
        trendFooter={<ArrowDownIcon />}
        trendDirection="down"
      />

      <div
        className="flex grow cursor-pointer"
        onClick={() =>
          window.open(
            "https://www.healthline.com/health/high-blood-pressure-hypertension/hypertension-related-conditions#Article-resources"
          )
        }
      >
        <StatCard
          title={
            <>
              <BriefcaseMedicalIcon className="text-red-500" />
              Category
            </>
          }
          // primaryValue={bloodPressureReading.category.replaceAll("_", " ")}
          primaryValue="HTN 2"
          primaryFooter="learn more"
        />
      </div>
    </div>
  )
}

const NotesOnlyResult = ({ result }: { result: ResultType }) => {
  return (
    <div className="flex h-full grow justify-start">
      <p>{result.notes}</p>
    </div>
  )
}

const StatCard = ({
  title,
  primaryValue,
  primaryFooter,
  trendValue,
  trendFooter,
  trendDirection,
}: {
  title: ReactNode
  primaryValue: string | number
  primaryFooter?: string
  trendValue?: string | number
  trendFooter?: ReactNode
  trendDirection?: "up" | "down" | "neutral" // assumes up is bad, down is good
}) => {
  return (
    <div className="flex grow flex-col">
      <div className="flex items-center justify-center gap-1 rounded-t border bg-accent p-1 uppercase">
        {title}
      </div>
      <div className="flex grow items-center gap-2 rounded-b border p-1">
        <div className="flex grow flex-col items-center justify-center">
          <span className="text-xl">{primaryValue}</span>
          {primaryFooter && (
            <span className="text-sm text-muted-foreground">
              {primaryFooter}
            </span>
          )}
        </div>
        {trendValue !== undefined && (
          <>
            <Separator orientation="vertical" />
            <div
              className={`flex w-8 flex-col items-center gap-1 p-1 ${trendDirection === "neutral" ? "text-muted-foreground" : trendDirection === "down" ? "text-green-400" : "text-destructive"}`}
            >
              <span>{trendValue}</span>
              {trendFooter}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
