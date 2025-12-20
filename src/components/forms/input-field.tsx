import type { FC, InputHTMLAttributes } from "react"
import type { FieldError } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: FieldError
  helperText?: string
  icon?: FC<{ className?: string }>
}

export const InputField: FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          className={cn(
            Icon && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {Icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
      {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  )
}
