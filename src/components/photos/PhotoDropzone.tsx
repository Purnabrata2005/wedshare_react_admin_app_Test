import { useCallback } from "react"
import { Upload } from "lucide-react"

interface PhotoDropzoneProps {
  isDragging: boolean
  isDisabled: boolean
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onFileSelect: (files: FileList | null) => void
}

export function PhotoDropzone({
  isDragging,
  isDisabled,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
}: PhotoDropzoneProps) {
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files)
  }, [onFileSelect])

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 bg-muted/30"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex flex-col items-center gap-3">
        <Upload className="w-8 h-8 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">
            {isDragging ? "Drop photos here" : "Drag & drop photos here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse from your computer
          </p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          disabled={isDisabled}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Browse Files
        </label>
      </div>
    </div>
  )
}