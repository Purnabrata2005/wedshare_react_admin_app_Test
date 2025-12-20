import type { FC, InputHTMLAttributes } from "react"
import type { FieldError } from "react-hook-form"
import { cn } from "@/lib/utils"

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  description?: string
}

export const CheckboxField: FC<CheckboxFieldProps> = ({
  label,
  error,
  description,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-input accent-primary",
            "focus:ring-2 focus:ring-ring cursor-pointer",
            error && "border-destructive",
            className
          )}
          {...props}
        />
        <label className="ml-2 block text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground ml-6">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  )
}
