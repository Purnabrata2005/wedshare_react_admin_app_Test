import { Calendar } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import { WeddingCardsSkeletonGrid } from "@/components/ui/wedding-card-skeleton"
import { AvatarDropdown } from "./AvatarDropdown"
import { Outlet } from "react-router-dom"

export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-wedshare-light-bg dark:bg-wedshare-dark-bg transition-colors">
      <Navbar 
        icon={Calendar}
        title="Your Weddings"
        subtitle="Loading your wedding events..."
      >
        <AvatarDropdown />
      </Navbar>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-6">
          <div>
            <div className="h-8 bg-muted/20 rounded-lg w-48 animate-pulse" />
            <div className="h-5 bg-muted/20 rounded w-64 mt-2 animate-pulse" />
          </div>
          <WeddingCardsSkeletonGrid />
        </div>
      </main>
      <Outlet />
    </div>
  )
}