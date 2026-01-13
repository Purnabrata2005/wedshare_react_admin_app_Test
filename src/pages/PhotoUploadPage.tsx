import { useState, type DragEvent, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { Upload, ImageIcon } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/ui/navbar"
import {
  PhotoDropzone,
  PhotoGrid,
  UploadingOverlay,
  UploadStats,
} from "@/components/photos"
import { uploadPhotosRequest } from "@/redux/slices/photoSlice"
import type { RootState } from "@/redux/store"
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

interface LocationState {
  weddingId?: string
}

export default function PhotoUploadPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const state = location.state as LocationState | null
  const weddingId = state?.weddingId || ""

  if (!weddingId) {
    navigate("/dashboard", { replace: true })
  }

  const [photos, setPhotos] = useState<LocalPhoto[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const uploading = useSelector((state: RootState) => state.photos?.uploading)
  const progressMap = useSelector(
    (state: RootState) =>
      (state.photos?.byWeddingId?.[weddingId] as Record<string, PhotoProgressInfo>) || {}
  )

  const isUploading = Boolean(uploading)
  const totalPhotos = photos.length
  const selectedPhotoUuids = new Set(photos.map(p => p.uuid))

  const completedPhotos = Object.entries(progressMap).filter(
    ([uuid, p]) => selectedPhotoUuids.has(uuid) && p.status === "completed"
  ).length

  const uploadingPhotos = Object.entries(progressMap).filter(
    ([uuid, p]) => selectedPhotoUuids.has(uuid) && p.status === "uploading"
  ).length

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newItems: LocalPhoto[] = []

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const uuid = uuidv4()
      const url = URL.createObjectURL(file)

      newItems.push({
        uuid,
        url,
        file,
        extension: ext,
      })
    })

    setPhotos((prev) => [...prev, ...newItems])
  }, [])

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleDeletePhoto = (index: number) => {
    setPhotos((prev) => {
      const photo = prev[index]
      if (photo) {
        URL.revokeObjectURL(photo.url)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleUploadToServer = () => {
    if (photos.length === 0 || isUploading) return
    dispatch(
      uploadPhotosRequest({
        weddingId,
        photos: photos.map((item) => ({
          uuid: item.uuid,
          file: item.file,
          extension: item.extension,
          originalFilename: item.file.name,
        })),
      })
    )
  }

  const handleClearAll = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url))
    setPhotos([])
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-background">
      <UploadingOverlay isVisible={isUploading} />

      <Navbar
        title="Upload Photos"
        subtitle="Add photos to your wedding gallery"
        showBackButton
        onBackClick={handleBack}
      />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {totalPhotos > 0 && (
            <Card>
              <CardContent className="py-4">
                <UploadStats
                  totalPhotos={totalPhotos}
                  completedPhotos={completedPhotos}
                  uploadingPhotos={uploadingPhotos}
                  isUploading={isUploading}
                  onClearAll={handleClearAll}
                  onUploadToServer={handleUploadToServer}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Select Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoDropzone
                isDragging={isDragging}
                isDisabled={isUploading}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onFileSelect={processFiles}
              />
            </CardContent>
          </Card>

          {photos.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Selected Photos
                    <Badge variant="outline" className="ml-2">
                      {photos.length}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <PhotoGrid
                  photos={photos}
                  progressMap={progressMap}
                  isUploading={isUploading}
                  onDeletePhoto={handleDeletePhoto}
                />
              </CardContent>
            </Card>
          )}

          {photos.length === 0 && (
            <Card className="bg-muted/30">
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  <p className="text-lg text-muted-foreground">
                    No photos selected yet
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Start by dragging and dropping images above, or click to browse
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}