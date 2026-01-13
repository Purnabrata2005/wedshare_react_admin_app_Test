import { PhotoThumbnail } from "./PhotoThumbnail"
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
  isUploading?: boolean
  onDeletePhoto: (index: number) => void
}

export function PhotoGrid({
  photos,
  progressMap,
  isUploading = false,
  onDeletePhoto,
}: PhotoGridProps) {
  if (photos.length === 0) return null

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
      {photos.map((item, index) => {
        const progressInfo = progressMap[item.uuid]
        const progress = progressInfo?.progress ?? 0
        const status = progressInfo?.status ?? "pending"

        return (
          <PhotoThumbnail
            key={item.uuid}
            url={item.url}
            fileName={item.file.name}
            fileSize={item.file.size}
            index={index}
            progress={progress}
            status={status}
            isUploading={isUploading}
            onDelete={onDeletePhoto}
          />
        )
      })}
    </div>
  )
}
