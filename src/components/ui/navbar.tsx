import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface NavbarProps {
  icon?: LucideIcon
  title: string
  subtitle?: string
  className?: string
  children?: ReactNode
  onBackClick?: () => void
  showBackButton?: boolean
  avatarSrc?: string
  avatarAlt?: string
  avatarFallback?: string
  userFullname?: string
  userEmail?: string
}

export function Navbar({ 
  icon: Icon, 
  title, 
  subtitle, 
  className,
  children,
  onBackClick,
  showBackButton = false,
  avatarSrc,
  avatarAlt = "User avatar",
  avatarFallback,
  userFullname,
  userEmail
}: NavbarProps) {
  return (
    <nav className={cn("bg-primary text-primary-foreground", className)}>
      <div className="flex items-center gap-3 px-6 py-4">
        {showBackButton && onBackClick && (
          <button
            onClick={onBackClick}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {Icon && !showBackButton && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/10">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-primary-foreground/80">{subtitle}</p>}
        </div>
        {children && <div className="ml-auto mr-4">{children}</div>}
        {(avatarSrc || avatarFallback) ? (
          <div className="flex items-center gap-3">
            {userFullname && userEmail && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-tight">{userFullname}</p>
                <p className="text-xs text-primary-foreground/70">{userEmail}</p>
              </div>
            )}
            <Avatar className="h-10 w-10 ring-2 ring-white/30">
              <AvatarImage src={avatarSrc} alt={avatarAlt} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-semibold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
