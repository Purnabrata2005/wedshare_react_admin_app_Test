import { Calendar, MapPin, MoreVertical, Trash2 } from "lucide-react"
import { useDispatch } from "react-redux"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
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
    <Card
      onClick={handleCardClick}
      className="wedding-card"
    >
      <CardHeader className="wedding-card-header">
        {/* Ellipsis Menu */}
        <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="wedding-card-menu-trigger"
                aria-label="Open menu"
              >
                <MoreVertical className="wedding-card-menu-icon" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <DropdownMenuItem
                  onClick={handleEdit}
                  className="wedding-card-edit-item"
                >
                  <span className="wedding-card-edit-text">Edit</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                className="wedding-card-delete-item"
              >
                <span className="wedding-card-delete-text">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Wedding Title */}
        <CardTitle className="wedding-card-title pr-10">
          {wedding.brideName} & {wedding.groomName}'s Wedding
        </CardTitle>
      </CardHeader>

      <CardContent className="wedding-card-content">
        {/* Date */}
        <div className="wedding-card-info">
          <Calendar className="wedding-card-icon" />
          <span className="truncate font-medium">{formattedDate}</span>
        </div>

        {/* Venue */}
        <div className="wedding-card-info">
          <MapPin className="wedding-card-icon" />
          <span className="truncate font-medium">{wedding.weddingVenue}</span>
        </div>
      </CardContent>
    </Card>
  )
}
