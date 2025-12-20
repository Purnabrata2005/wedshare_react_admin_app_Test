import { cn } from "@/lib/utils"

interface WeddingHeaderProps {
  /** Bride's name */
  brideName: string
  /** Groom's name */
  groomName: string
  /** Optional subtitle (e.g., "Wedding Celebration") */
  subtitle?: string
  /** Optional additional className */
  className?: string
}

/**
 * A reusable wedding header component that displays the couple's names
 * with responsive typography.
 */
export function WeddingHeader({
  brideName,
  groomName,
  subtitle = "Wedding Celebration",
  className,
}: WeddingHeaderProps) {
  return (
    <div className={cn("space-y-2 mb-2", className)}>
      <h1 className="text-2xl sm:text-4xl font-bold break-words text-balance text-foreground">
        {brideName} & {groomName}
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}

export default WeddingHeader
