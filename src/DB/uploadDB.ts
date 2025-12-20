// src/db/photoDB.ts
import Dexie, { type Table } from "dexie"

export type UploadStatus = "pending" | "uploading" | "failed" | "completed"

export interface PendingPhoto {
  uuid: string
  weddingId: string
  file: Blob            // File is also a Blob, so this works
  extension: string
  originalFilename: string  // Original filename for metadata registration
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

    // Version 2: Added originalFilename field
    this.version(2).stores({
      // primary key: uuid
      // indexes: weddingId, status, createdAt
      queue: "uuid,weddingId,status,createdAt",
    }).upgrade(tx => {
      // Migrate existing records to include originalFilename
      return tx.table("queue").toCollection().modify(photo => {
        if (!photo.originalFilename) {
          photo.originalFilename = `${photo.uuid}.${photo.extension}`
        }
      })
    })

    this.version(1).stores({
      queue: "uuid,weddingId,status,createdAt",
    })

    this.queue = this.table("queue")
  }
}

export const photoDB = new PhotoDB()
