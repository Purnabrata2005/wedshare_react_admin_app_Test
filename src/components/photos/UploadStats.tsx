import { ImageIcon, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface UploadStatsProps {
  totalPhotos: number
  completedPhotos: number
  uploadingPhotos: number
  isUploading: boolean
  onClearAll: () => void
  onUploadToServer: () => void
}

export function UploadStats({
  totalPhotos,
  completedPhotos,
  uploadingPhotos,
  isUploading,
  onClearAll,
  onUploadToServer,
}: UploadStatsProps) {
  if (totalPhotos === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          <span className="font-medium">Selected Photos:</span>
          <Badge variant="secondary">{totalPhotos}</Badge>
        </div>
        {completedPhotos > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Uploaded:</span>
            <Badge variant="default">{completedPhotos}</Badge>
          </div>
        )}
        {uploadingPhotos > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">In Progress:</span>
            <Badge variant="outline">{uploadingPhotos}</Badge>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          disabled={isUploading}
        >
          Clear All
        </Button>
        <Button
          size="sm"
          onClick={onUploadToServer}
          disabled={isUploading || totalPhotos === 0}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload Photos"}
        </Button>
      </div>
    </div>
  )
}