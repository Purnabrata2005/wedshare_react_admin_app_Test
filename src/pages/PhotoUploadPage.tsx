import { useState, type DragEvent, useCallback, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { Upload, ImageIcon } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/ui/navbar"
import {
  PhotoDropzone,
  PhotoGrid,
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

  /**
   * ============================
   * V3: DERIVED UPLOADING STATE
   * ============================
   */
  const progressMap = useSelector(
    (state: RootState) =>
      (state.photos.byWeddingId?.[weddingId] as Record<
        string,
        PhotoProgressInfo
      >) || {}
  )

  const isUploading = useMemo(() => {
    return Object.values(progressMap).some(
      (p) => p.status === "queued" || p.status === "uploading"
    )
  }, [progressMap])

  /**
   * ============================
   * UPLOAD STATS (SELECTED ONLY)
   * ============================
   */
  const totalPhotos = photos.length
  const selectedPhotoUuids = useMemo(
    () => new Set(photos.map((p) => p.uuid)),
    [photos]
  )

  const completedPhotos = Object.entries(progressMap).filter(
    ([uuid, p]) =>
      selectedPhotoUuids.has(uuid) && p.status === "completed"
  ).length

  const uploadingPhotos = Object.entries(progressMap).filter(
    ([uuid, p]) =>
      selectedPhotoUuids.has(uuid) &&
      (p.status === "queued" || p.status === "uploading")
  ).length

  /**
   * ============================
   * FILE PROCESSING
   * ============================
   */
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

  /**
   * ============================
   * DRAG & DROP HANDLERS
   * ============================
   */
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  /**
   * ============================
   * PHOTO MANAGEMENT
   * ============================
   */
  const handleDeletePhoto = (index: number) => {
    setPhotos((prev) => {
      const photo = prev[index]
      if (photo) URL.revokeObjectURL(photo.url)
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

  /**
   * ============================
   * RENDER
   * ============================
   */
  return (
    <div className="min-h-screen bg-background">
      <Navbar
        title="Upload Photos"
        subtitle="Add photos to your wedding gallery"
        showBackButton
        onBackClick={handleBack}
      />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Upload Stats */}
          {totalPhotos > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <span className="font-medium">
                        Selected Photos:
                      </span>
                      <Badge variant="secondary">
                        {totalPhotos}
                      </Badge>
                    </div>

                    {completedPhotos > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Uploaded:
                        </span>
                        <Badge>{completedPhotos}</Badge>
                      </div>
                    )}

                    {uploadingPhotos > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          In Progress:
                        </span>
                        <Badge variant="outline">
                          {uploadingPhotos}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      disabled={isUploading}
                    >
                      Clear All
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleUploadToServer}
                      disabled={isUploading || totalPhotos === 0}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {isUploading
                        ? "Uploading..."
                        : "Upload Photos"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dropzone */}
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

          {/* Photo Grid */}
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

                  <Button
                    onClick={handleUploadToServer}
                    disabled={isUploading}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading
                      ? "Uploading..."
                      : "Upload All"}
                  </Button>
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

          {/* Empty State */}
          {photos.length === 0 && (
            <Card className="bg-muted/30">
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  <p className="text-lg text-muted-foreground">
                    No photos selected yet
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Drag & drop images above or click to browse
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
