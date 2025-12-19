// src/db/photoDB.ts
import Dexie, { type Table } from "dexie"

export type UploadStatus = "pending" | "uploading" | "failed" | "completed"

export interface PendingPhoto {
  uuid: string
  weddingId: string
  file: Blob            // File is also a Blob, so this works
  extension: string
  status: UploadStatus
  progress: number
  retries: number
  createdAt: number
  metadataRegistered?: boolean  // Track if metadata has been sent to backend
}

class PhotoDB extends Dexie {
  queue!: Table<PendingPhoto, string>

  constructor() {
    super("PhotoUploadDB")

    this.version(1).stores({
      // primary key: uuid
      // indexes: weddingId, status, createdAt
      queue: "uuid,weddingId,status,createdAt",
    })

    this.queue = this.table("queue")
  }
}

export const photoDB = new PhotoDB()
