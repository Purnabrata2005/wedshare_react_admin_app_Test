import Dexie, { type Table } from "dexie"

export type UploadStatus =
  | "queued"
  | "uploading"
  | "paused"
  | "failed"
  | "completed"
  | "cancelled"

export interface PendingPhoto {
  uuid: string
  weddingId: string
  file: Blob
  extension: string
  originalFilename: string

  status: UploadStatus
  progress: number
  retries: number
  createdAt: number

  metadataRegistered: boolean
  uploadSessionId: string
  lastError?: string

  crypto?: {
    wrappedPhotoKey?: string
    wrappedProcessKey?: string
  }
}

class PhotoDB extends Dexie {
  queue!: Table<PendingPhoto, string>

  constructor() {
    super("PhotoUploadDB")

    this.version(3).stores({
      queue:
        "uuid,weddingId,status,createdAt,metadataRegistered,uploadSessionId",
    })

    this.queue = this.table("queue")
  }
}

export const photoDB = new PhotoDB()
