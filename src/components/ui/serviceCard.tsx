import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
  /** Icon to display (should be a Lucide icon component) */
  icon: ReactNode
  /** Title of the service */
  title: string
  /** Brief description of the service */
  description: string
  /** Click handler */
  onClick?: () => void
  /** Optional additional className */
  className?: string
  /** Whether the card is disabled */
  disabled?: boolean
}

/**
 * A reusable service card component for displaying wedding services.
 * Uses shadcn Card with hover effects and responsive design.
 */
export function ServiceCard({
  icon,
  title,
  description,
  onClick,
  className,
  disabled = false,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300",
        "hover:border-primary/30 hover:shadow-lg hover:scale-[1.02]",
        "active:scale-[1.01]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        {/* Icon Container */}
        <div
          className={cn(
            "mb-4 p-3 rounded-full",
            "bg-primary/10 text-primary",
            "transition-colors duration-300",
            "group-hover:bg-primary group-hover:text-primary-foreground"
          )}
        >
          <div className="w-6 h-6">{icon}</div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default ServiceCard
