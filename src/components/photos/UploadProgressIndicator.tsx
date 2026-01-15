import { useSelector } from "react-redux"
import { Loader2 } from "lucide-react"
import type { RootState } from "@/redux/store"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
// import type { UploadStatus } from "@/DB/uploadDB"

export function UploadProgressIndicator() {
  /**
   * V3 RULE:
   * Uploading state is DERIVED, not stored
   */
  const byWeddingId = useSelector(
    (state: RootState) => state.photos.byWeddingId
  )

  // Flatten all photos across all weddings
  const allPhotos = Object.values(byWeddingId).flatMap((wedding) =>
    Object.values(wedding)
  )

  if (allPhotos.length === 0) return null

  const isUploading = allPhotos.some(
    (p) => p.status === "queued" || p.status === "uploading"
  )

  if (!isUploading) return null

  const total = allPhotos.length
  const completed = allPhotos.filter(
    (p) => p.status === "completed"
  ).length

  const percent = Math.round((completed / total) * 100)

  return (
    <>
      {/* ================= MOBILE VIEW ================= */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-background border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />

          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">
              Uploading photos ({completed}/{total})
            </p>
            <Progress value={percent} className="h-1.5 mt-1" />
          </div>

          <span className="text-xs font-semibold text-muted-foreground">
            {percent}%
          </span>
        </div>
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block fixed bottom-4 right-4 z-50 w-80">
        <Card className="p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />

            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Uploading photos
              </p>
              <p className="text-xs text-muted-foreground">
                {completed} of {total} completed
              </p>
            </div>

            <span className="text-sm font-bold text-foreground">
              {percent}%
            </span>
          </div>

          <Progress value={percent} className="h-2 mt-3" />
        </Card>
      </div>
    </>
  )
}
