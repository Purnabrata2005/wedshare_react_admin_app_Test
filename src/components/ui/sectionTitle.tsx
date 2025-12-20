import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionTitleProps {
  /** The title text */
  children: ReactNode
  /** Optional additional className */
  className?: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
}

/**
 * A reusable section title component with consistent styling.
 */
export function SectionTitle({
  children,
  className,
  size = "md",
}: SectionTitleProps) {
  const sizeClasses = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  }

  return (
    <h2
      className={cn(
        "font-bold text-foreground mb-4",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </h2>
  )
}

export default SectionTitle
