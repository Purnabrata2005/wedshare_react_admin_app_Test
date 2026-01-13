import type React from "react"
import { type DragEvent, useRef } from "react"
import { ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhotoDropzoneProps {
  isDragging: boolean
  isDisabled?: boolean
  onDragEnter: (e: DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void
  onDragOver: (e: DragEvent<HTMLDivElement>) => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
  onFileSelect: (files: FileList | null) => void
}

export function PhotoDropzone({
  isDragging,
  isDisabled = false,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
}: PhotoDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!isDisabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files)
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none",
        isDragging
          ? "scale-[1.02] border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-card",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 sm:gap-4 sm:py-12 sm:px-6">
        <div
          className={cn(
            "rounded-full p-4 sm:p-6 transition-all duration-300",
            isDragging ? "bg-primary/15" : "bg-muted"
          )}
        >
          <ImagePlus
            className={cn(
              "w-8 h-8 sm:w-12 sm:h-12 transition-colors duration-300",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>
        <div className="text-center space-y-1 sm:space-y-2">
          <p className="text-base sm:text-xl font-semibold text-foreground">
            {isDragging ? "Drop your photos here" : "Upload your photos"}
          </p>
          <p className="text-xs sm:text-sm max-w-md leading-relaxed px-2 text-muted-foreground">
            Drag and drop your images here, or click to browse from your device
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isDisabled}
        />
      </div>
    </div>
  )
}
