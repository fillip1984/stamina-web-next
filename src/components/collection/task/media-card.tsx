import type { TaskType } from "@/server/api/types"
import Image from "next/image"

export default function MediaCard({ task }: { task: TaskType }) {
  return (
    <div className="mb-2 rounded-lg border p-2">
      <h6 className="mb-1 text-lg font-semibold">{task.name}</h6>
      {task.description && (
        <p className="text-sm text-gray-400">{task.description}</p>
      )}
      <Image
        src="https://image.tmdb.org/t/p/original/ydf1CeiBLfdxiyNTpskM0802TKl.jpg"
        alt={task.name}
        width={500}
        height={300}
      />

      <div
        onClick={() => window.open("https://www.themoviedb.org/")}
        className="mt-2 flex w-full justify-end"
      >
        <Image
          src="/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
          alt={task.name}
          height={10}
          width={100}
          className="cursor-pointer"
        />
      </div>
    </div>
  )
}
