import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface UploadingOverlayProps {
  isVisible: boolean
  title?: string
  subtitle?: string
}

export function UploadingOverlay({
  isVisible,
  title = "Uploading Photos...",
  subtitle = "Please wait while we upload your images",
}: UploadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="max-w-sm w-full shadow-2xl">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <p className="text-base sm:text-lg font-semibold text-foreground">
              {title}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
