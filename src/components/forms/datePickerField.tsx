import { type FC, useRef, useState } from "react"
import { Calendar } from "lucide-react"
import type { FieldError } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { CalendarPicker } from "@/components/layout/calendarPicker"
import { cn } from "@/lib/utils"

interface DatePickerFieldProps {
  label?: string
  value: string
  onChange: (date: string) => void
  error?: FieldError
  placeholder?: string
  disabled?: boolean
}

export const DatePickerField: FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = "dd-mm-yyyy",
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    return `${day}-${month}-${year}`
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={formatDateForDisplay(value || "")}
          onClick={() => !disabled && setIsPickerOpen(true)}
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "pr-10 cursor-pointer",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsPickerOpen(true)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed"
          aria-label="Open date picker"
        >
          <Calendar className="w-5 h-5" />
        </button>

        {isPickerOpen && (
          <div className="absolute z-50 top-full mt-2 left-0">
            <CalendarPicker
              value={value || ""}
              onChange={(date) => {
                onChange(date)
                setIsPickerOpen(false)
              }}
              onClose={() => setIsPickerOpen(false)}
            />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  )
}
