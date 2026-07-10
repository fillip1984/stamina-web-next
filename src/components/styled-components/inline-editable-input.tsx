import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Textarea } from "../ui/textarea"

export default function InlineEditableInput({
  value,
  onChange,
  onBlur,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  className?: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    if (isEditing) {
      if (textareaRef.current) {
        // set cursor at the end of existing text
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length
        )
      }
    }
  }, [isEditing])

  return (
    <>
      {isEditing ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setIsEditing(false)
            onBlur()
          }}
          ref={textareaRef}
          className={cn("w-full resize-none select-none", className)}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="w-full cursor-pointer"
        >
          {value.trim().length > 0 ? value : "No description"}
        </div>
      )}
    </>
  )
}
