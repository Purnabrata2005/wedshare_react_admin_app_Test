import type { FC } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InvitationTemplate {
  id: number
  title: string
  text: string
}

interface TemplatePreview {
  value: {
    bride?: string
    groom?: string
    date?: string
    venue?: string
  }
  placeholder?: string
}

interface InvitationTemplateSelectorProps {
  templates: InvitationTemplate[]
  selectedId: number
  onSelect: (templateId: number) => void
  preview?: TemplatePreview
}

export const InvitationTemplateSelector: FC<InvitationTemplateSelectorProps> = ({
  templates,
  selectedId,
  onSelect,
  preview,
}) => {
  const getPreviewText = (template: InvitationTemplate) => {
    if (preview?.value) {
      return template.text
        .replace(/\[Bride\]/g, preview.value.bride || "...")
        .replace(/\[Groom\]/g, preview.value.groom || "...")
        .replace(/\[Date\]/g, preview.value.date || "...")
        .replace(/\[Venue\]/g, preview.value.venue || "...")
    }
    return template.text.replace(/\[Groom\]|\[Bride\]/g, "...").replace(/\[.*?\]/g, "...")
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onSelect(template.id)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              e.stopPropagation()
              onSelect(template.id)
            }
          }}
          className={cn(
            "p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-left",
            selectedId === template.id
              ? "border-primary bg-primary/5 shadow-lg scale-105"
              : "border-input hover:border-primary/30"
          )}
        >
          <p className="font-bold flex items-center mb-2 text-foreground">
            {template.title}
            {selectedId === template.id && (
              <Check className="w-4 h-4 ml-2 text-primary" />
            )}
          </p>
          <p className="text-xs italic line-clamp-3 text-muted-foreground">
            {getPreviewText(template)}
          </p>
        </div>
      ))}
    </div>
  )
}
