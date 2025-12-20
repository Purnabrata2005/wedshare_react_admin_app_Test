import { Calendar, MapPin, MoreVertical, Trash2 } from "lucide-react"
import { useDispatch } from "react-redux"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { deleteWeddingRequest, selectWedding } from "@/redux/slices/weddingSlice"
import type { AppDispatch } from "@/redux/store"
import type { Wedding } from "@/redux/slices/weddingSlice"

interface WeddingCardProps {
  wedding: Wedding
  onClick: (wedding: Wedding) => void
  onEdit?: (wedding: Wedding) => void
}

export function WeddingCard({ wedding, onClick, onEdit }: WeddingCardProps) {
  const dispatch = useDispatch<AppDispatch>()

  const handleCardClick = () => {
    dispatch(selectWedding(wedding))
    onClick(wedding)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(wedding)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(deleteWeddingRequest(wedding.weddingId || wedding.id))
  }

  const formattedDate = new Date(wedding.weddingDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div
      onClick={handleCardClick}
      className="relative w-full max-w-full rounded-2xl p-6 bg-gradient-to-br from-wedshare-light-surface to-wedshare-light-bg shadow-md border-2 border-transparent cursor-pointer transition-all duration-300 overflow-hidden group hover:shadow-lg hover:scale-105 active:scale-102 dark:from-wedshare-dark-surface dark:to-wedshare-dark-bg"
    >
      {/* Ellipsis Menu */}
      <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              aria-label="Open menu"
            >
              <MoreVertical className="w-5 h-5 text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <DropdownMenuItem
                onClick={handleEdit}
                className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <span className="text-wedshare-light-primary dark:text-wedshare-dark-primary font-medium">Edit</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 focus:bg-red-100 dark:focus:bg-red-900/30 transition-colors"
            >
              <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Wedding Title */}
      <p className="font-bold text-lg sm:text-xl break-words whitespace-normal line-clamp-2 mt-1 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary tracking-tight">
        {wedding.brideName} & {wedding.groomName}'s Wedding
      </p>

      {/* Date */}
      <div className="flex items-center text-sm mt-4 overflow-hidden text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
        <Calendar className="w-5 h-5 mr-2 shrink-0 text-wedshare-light-primary dark:text-wedshare-dark-primary" />
        <span className="truncate font-medium">{formattedDate}</span>
      </div>

      {/* Venue */}
      <div className="flex items-center text-sm mt-2 overflow-hidden text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
        <MapPin className="w-5 h-5 mr-2 shrink-0 text-wedshare-light-primary dark:text-wedshare-dark-primary" />
        <span className="truncate font-medium">{wedding.venue}</span>
      </div>
    </div>
  )
}
