import { Calendar, MapPin, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventScheduleCardProps {
  /** Title of the event (e.g., "Wedding", "Reception") */
  title: string
  /** Formatted date string */
  date: string
  /** Venue/location of the event */
  location: string
  /** Optional custom date icon */
  dateIcon?: LucideIcon
  /** Optional custom location icon */
  locationIcon?: LucideIcon
  /** Optional additional className */
  className?: string
}

/**
 * A reusable event schedule card that displays event details
 * with responsive layouts for mobile and desktop.
 */
export function EventScheduleCard({
  title,
  date,
  location,
  dateIcon: DateIcon = Calendar,
  locationIcon: LocationIcon = MapPin,
  className,
}: EventScheduleCardProps) {
  return (
    <div className={cn("py-4", className)}>
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 sm:hidden">
        {/* Calendar icon and date section */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-7 flex flex-col items-center gap-1">
            <DateIcon className="w-6 h-6 text-primary" />
            <span className="text-xs font-medium text-center text-muted-foreground">
              {title}
            </span>
          </div>
          <div className="flex-1 pt-0.5">
            <span className="font-medium text-sm text-foreground">{date}</span>
          </div>
        </div>

        {/* Location icon and venue section */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-7 flex flex-col items-center gap-1">
            <LocationIcon className="w-6 h-6 text-primary" />
            <span className="text-xs font-medium text-center text-muted-foreground">
              Location
            </span>
          </div>
          <div className="flex-1 pt-0.5">
            <span className="font-medium text-sm break-words text-foreground">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-row items-start sm:items-center gap-4">
        {/* Date Icon and label */}
        <div className="flex items-center sm:flex-col sm:items-center sm:mr-4 min-w-16">
          <DateIcon className="w-6 h-6 mb-2 sm:mb-0 text-primary" />
          <span className="text-xs font-medium sm:mt-2 text-muted-foreground">
            {title}
          </span>
        </div>

        {/* Date */}
        <div className="sm:flex-1">
          <span className="font-medium whitespace-nowrap text-foreground">
            {date}
          </span>
        </div>

        {/* Location pin and venue */}
        <div className="flex items-center sm:flex-col sm:items-center sm:mr-4 min-w-16">
          <LocationIcon className="w-6 h-6 mb-2 sm:mb-0 text-primary" />
          <span className="text-xs font-medium sm:mt-2 text-muted-foreground">
            Location
          </span>
        </div>
        <div className="sm:flex-1">
          <span className="font-medium break-words text-foreground">
            {location}
          </span>
        </div>
      </div>
    </div>
  )
}

export default EventScheduleCard
