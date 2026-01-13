import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { UploadStatus } from "@/DB/uploadDB"

interface PhotoThumbnailProps {
  url: string
  fileName: string
  fileSize: number
  index: number
  progress?: number
  status?: UploadStatus
  isUploading?: boolean
  onDelete: (index: number) => void
}

export function PhotoThumbnail({
  url,
  fileName,
  fileSize,
  index,
  progress = 0,
  status = "pending",
  isUploading = false,
  onDelete,
}: PhotoThumbnailProps) {
  const canDelete = status !== "completed" && status !== "uploading"
  const fileSizeFormatted = (fileSize / 1024 / 1024).toFixed(2)

  const getStatusBadgeVariant = () => {
    switch (status) {
      case "completed":
        return "default"
      case "uploading":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-card border border-border">
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={url}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Delete Button */}
        {canDelete && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(index)}
            disabled={isUploading}
            className={cn(
              "absolute top-1 right-1 sm:top-2 sm:right-2",
              "h-7 w-7 sm:h-8 sm:w-8 rounded-full",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
              "transition-all duration-200 shadow-md"
            )}
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}

        {/* Progress Overlay */}
        {status !== "pending" && (
          <div className="absolute inset-x-0 bottom-0 p-2 pt-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Badge variant={getStatusBadgeVariant()} className="text-[10px] capitalize h-5">
                  {status}
                </Badge>
                <span className="text-[10px] text-white font-medium">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          </div>
        )}
      </div>

      {/* File Info (visible on md+) */}
      <div className="p-2 hidden md:block">
        <p className="text-xs truncate font-medium text-muted-foreground">
          {fileName}
        </p>
        <p className="text-[10px] mt-0.5 text-muted-foreground/70">
          {fileSizeFormatted} MB
        </p>
      </div>
    </div>
  )
}
