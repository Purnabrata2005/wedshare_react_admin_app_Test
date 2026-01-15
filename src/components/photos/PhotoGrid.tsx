import { useDispatch } from "react-redux"
import { PhotoThumbnail } from "./PhotoThumbnail"
import type { UploadStatus } from "@/DB/uploadDB"
import {
  pausePhoto,
  resumePhoto,
  cancelPhoto,
} from "@/redux/slices/photoSlice"

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
  weddingId: string
  photos: LocalPhoto[]
  progressMap: Record<string, PhotoProgressInfo>
  onDeletePhoto: (index: number) => void
}

export function PhotoGrid({
  weddingId,
  photos,
  progressMap,
  onDeletePhoto,
}: PhotoGridProps) {
  const dispatch = useDispatch()

  if (photos.length === 0) return null

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
      {photos.map((item, index) => {
        const progressInfo = progressMap[item.uuid]
        const progress = progressInfo?.progress ?? 0
        const status: UploadStatus =
          progressInfo?.status ?? "queued"

        return (
          <PhotoThumbnail
            key={item.uuid}
            url={item.url}
            fileName={item.file.name}
            fileSize={item.file.size}
            index={index}
            progress={progress}
            status={status}
            onPause={() =>
              dispatch(
                pausePhoto({
                  weddingId,
                  uuid: item.uuid,
                })
              )
            }
            onResume={() =>
              dispatch(
                resumePhoto({
                  weddingId,
                  uuid: item.uuid,
                })
              )
            }
            onCancel={() =>
              dispatch(
                cancelPhoto({
                  weddingId,
                  uuid: item.uuid,
                })
              )
            }
            onDelete={onDeletePhoto}
          />
        )
      })}
    </div>
  )
}
