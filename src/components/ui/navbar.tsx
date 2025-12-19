import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavbarProps {
  icon?: LucideIcon
  title: string
  subtitle?: string
  className?: string
}

export function Navbar({ icon: Icon, title, subtitle, className }: NavbarProps) {
  return (
    <nav className={cn("bg-primary text-primary-foreground", className)}>
      <div className="flex items-center gap-3 px-6 py-4">
        {Icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/10">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-primary-foreground/80">{subtitle}</p>}
        </div>
      </div>
    </nav>
  )
}
