import { Trash2, Pause, Play, X } from "lucide-react"
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
  onDelete: (index: number) => void
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
}

export function PhotoThumbnail({
  url,
  fileName,
  fileSize,
  index,
  progress = 0,
  status = "queued",
  onDelete,
  onPause,
  onResume,
  onCancel,
}: PhotoThumbnailProps) {
  const fileSizeFormatted = (fileSize / 1024 / 1024).toFixed(2)

  const isQueued = status === "queued"
  const isUploading = status === "uploading"
  const isPaused = status === "paused"
  const isCompleted = status === "completed"
  const isFailed = status === "failed"
  const isCancelled = status === "cancelled"

  const canDelete =
    isCompleted || isFailed || isCancelled

  const getStatusBadgeVariant = () => {
    switch (status) {
      case "completed":
        return "default"
      case "uploading":
        return "secondary"
      case "paused":
        return "outline"
      case "failed":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-card border border-border">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={url}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Controls */}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center gap-2",
            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          )}
        >
          {/* Pause */}
          {isUploading && onPause && (
            <Button
              size="icon"
              variant="secondary"
              onClick={onPause}
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}

          {/* Resume */}
          {isPaused && onResume && (
            <Button
              size="icon"
              variant="secondary"
              onClick={onResume}
            >
              <Play className="w-4 h-4" />
            </Button>
          )}

          {/* Cancel */}
          {(isQueued || isUploading || isPaused) && onCancel && (
            <Button
              size="icon"
              variant="destructive"
              onClick={onCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {/* Delete */}
          {canDelete && (
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Progress Overlay */}
        {(isUploading || isPaused) && (
          <div className="absolute inset-x-0 bottom-0 p-2 pt-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Badge
                  variant={getStatusBadgeVariant()}
                  className="text-[10px] capitalize h-5"
                >
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

        {/* Completed / Failed / Cancelled Badge */}
        {(isCompleted || isFailed || isCancelled) && (
          <div className="absolute bottom-2 left-2">
            <Badge
              variant={getStatusBadgeVariant()}
              className="text-[10px] capitalize"
            >
              {status}
            </Badge>
          </div>
        )}
      </div>

      {/* File Info (md+) */}
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
