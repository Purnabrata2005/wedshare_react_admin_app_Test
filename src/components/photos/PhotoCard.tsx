import { X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UploadStatus } from "@/DB/uploadDB"

interface PhotoCardProps {
  uuid: string
  url: string
  filename: string
  progress?: number
  status?: UploadStatus
  isUploading?: boolean
  onDelete: () => void
}

export function PhotoCard({
  url,
  filename,
  progress = 0,
  status = "pending",
  isUploading = false,
  onDelete,
}: PhotoCardProps) {
  const getStatusIcon = () => {
    if (status === "completed") {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />
    }
    if (status === "uploading") {
      return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
    }
    if (status === "failed") {
      return <X className="w-6 h-6 text-red-500" />
    }
    return null
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
      {status === "uploading" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-2 right-2">
        {getStatusIcon()}
      </div>

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          disabled={isUploading}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Delete
        </Button>
      </div>

      {/* Filename */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-xs text-white truncate">{filename}</p>
      </div>
    </div>
  )
}