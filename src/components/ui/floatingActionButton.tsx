import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  size?: "sm" | "md" | "lg"
}

const positionClasses = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, position = "bottom-right", size = "md", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "fixed z-50 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95 flex items-center justify-center",
          positionClasses[position],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton }
