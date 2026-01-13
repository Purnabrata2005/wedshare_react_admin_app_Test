import { Loader2 } from "lucide-react"

interface UploadingOverlayProps {
  isVisible: boolean
}

export function UploadingOverlay({ isVisible }: UploadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-lg font-medium">Uploading photos...</p>
        <p className="text-sm text-muted-foreground">Please wait, do not close this page</p>
      </div>
    </div>
  )
}