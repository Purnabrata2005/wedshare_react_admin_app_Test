import { X, CheckCircle2, Loader2, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UploadStatus } from "@/DB/uploadDB"

interface PhotoCardProps {
  uuid: string
  url: string
  filename: string
  progress?: number
  status?: UploadStatus
  onDelete: () => void
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
}

export function PhotoCard({
  url,
  filename,
  progress = 0,
  status = "queued",
  onDelete,
  onPause,
  onResume,
  onCancel,
}: PhotoCardProps) {
  const isUploading = status === "uploading"
  const isQueued = status === "queued"
  const isPaused = status === "paused"
  const isCompleted = status === "completed"
  const isFailed = status === "failed"
  const isCancelled = status === "cancelled"

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />
      case "uploading":
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      case "paused":
        return <Pause className="w-6 h-6 text-yellow-500" />
      case "failed":
        return <X className="w-6 h-6 text-red-500" />
      case "cancelled":
        return <X className="w-6 h-6 text-muted-foreground" />
      default:
        return null
    }
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/50 hover:border-primary transition-colors">
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={url}
          alt={filename}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Progress Bar */}
      {(isUploading || isPaused) && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Status Icon */}
      <div className="absolute top-2 right-2">
        {getStatusIcon()}
      </div>

      {/* Hover Controls */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">

        {/* Pause */}
        {isUploading && onPause && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onPause}
            className="gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </Button>
        )}

        {/* Resume */}
        {isPaused && onResume && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onResume}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Resume
          </Button>
        )}

        {/* Cancel */}
        {(isQueued || isUploading || isPaused) && onCancel && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onCancel}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        )}

        {/* Delete (only after finished states) */}
        {(isCompleted || isFailed || isCancelled) && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Delete
          </Button>
        )}
      </div>

      {/* Filename */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-xs text-white truncate">{filename}</p>
      </div>
    </div>
  )
}
