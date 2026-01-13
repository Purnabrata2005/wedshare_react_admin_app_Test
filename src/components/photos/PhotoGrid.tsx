import { PhotoCard } from "./PhotoCard"
import type { UploadStatus } from "@/DB/uploadDB"

interface LocalPhoto {
  uuid: string
  url: string
  file: File
  extension: string
}

interface PhotoProgressInfo {
  progress: number
  status: UploadStatus
}

interface PhotoGridProps {
  photos: LocalPhoto[]
  progressMap: Record<string, PhotoProgressInfo>
  isUploading: boolean
  onDeletePhoto: (index: number) => void
}

export function PhotoGrid({
  photos,
  progressMap,
  isUploading,
  onDeletePhoto,
}: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {photos.map((photo, index) => {
        const progress = progressMap[photo.uuid]

        return (
          <PhotoCard
            key={photo.uuid}
            uuid={photo.uuid}
            url={photo.url}
            filename={photo.file.name}
            progress={progress?.progress || 0}
            status={progress?.status || "pending"}
            isUploading={isUploading}
            onDelete={() => onDeletePhoto(index)}
          />
        )
      })}
    </div>
  )
}