import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { clearSelection } from "@/redux/slices/weddingSlice";
import { Calendar, Plus, Moon, Sun } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import { WeddingCard } from "@/components/WeddingCard"
import {  WeddingCardsSkeletonGrid } from "@/components/ui/wedding-card-skeleton"
import { EmptyWeddingsState } from "@/components/EmptyWeddingsState"
import { FloatingActionButton } from "@/components/ui/floatingActionButton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/layout/theme-provider"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { loadWeddingsRequest, selectWedding } from "@/redux/slices/weddingSlice"
import type { Wedding } from "@/redux/slices/weddingSlice"
import ROUTES from "@/routePath"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { weddings, loading, error } = useAppSelector((state) => state.weddings)
  const { user } = useAppSelector((state) => state.auth)

  // Load weddings on component mount
  useEffect(() => {
    dispatch(loadWeddingsRequest())
  }, [dispatch])

  // Get user initials for avatar fallback
  const getAvatarFallback = () => {
    if (!user) return "U"
    const firstName = user.fullname?.charAt(0) || ""
    return (firstName ).toUpperCase() || "U"
  }

  const handleSelectWedding = (wedding: Wedding) => {
    console.log("Wedding selected:", wedding)
    const weddingId = wedding.weddingId || wedding.id
    if (weddingId) {
      dispatch(selectWedding(weddingId))
      navigate(ROUTES.WEDDING_DETAILS)
    }
  }

  const handleEditWedding = (wedding: Wedding) => {
    const weddingId = wedding.weddingId || wedding.id
    if (weddingId) {
      dispatch(selectWedding(weddingId))
      navigate(ROUTES.ADD_WEDDING)
    }
  }

  const handleAddWedding = () => {
    dispatch(clearSelection());
    navigate(ROUTES.ADD_WEDDING);
  }

  const AvatarDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer rounded-full hover:ring-2 hover:ring-white/50 transition-all">
          <Avatar className="h-10 w-10 ring-2 ring-white/30">
            <AvatarImage src="" alt={user?.fullname || "User"} />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-semibold">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground mb-2">Theme</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors ${
                theme === "light"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Sun className="w-4 h-4 mx-auto mb-1" />
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors ${
                theme === "dark"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Moon className="w-4 h-4 mx-auto mb-1" />
              Dark
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // Loading State
  if (loading) {
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

  return (
    <div className="min-h-screen bg-wedshare-light-bg dark:bg-wedshare-dark-bg transition-colors">
      {/* Navbar */}
      <Navbar
        icon={Calendar}
        title="Your Weddings"
        subtitle={weddings.length > 0 ? `${weddings.length} wedding${weddings.length !== 1 ? 's' : ''} registered` : "Create your first wedding"}
      >
        <AvatarDropdown />
      </Navbar>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 sm:p-6 bg-wedshare-light-error/10 dark:bg-wedshare-dark-error/20 border border-wedshare-light-error/30 dark:border-wedshare-dark-error/40 rounded-lg">
            <p className="text-sm sm:text-base text-wedshare-light-error dark:text-wedshare-dark-error font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {weddings.length === 0 && !loading ? (
          <EmptyWeddingsState onAddWedding={handleAddWedding} />
        ) : (
          // Weddings Grid
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
                Your Weddings
              </h2>
              <p className="text-sm sm:text-base text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary mt-2">
                Manage and organize all your wedding events
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {weddings.map((wedding) => (
                <WeddingCard
                  key={wedding.weddingId || wedding.id}
                  wedding={wedding}
                  onClick={handleSelectWedding}
                  onEdit={handleEditWedding}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Outlet for nested routes */}
      <Outlet />

      {/* Floating Action Button for Adding Wedding */}
      <FloatingActionButton
        position="bottom-right"
        size="md"
        onClick={handleAddWedding}
        className="rounded-full! w-auto! h-auto! px-6 py-3"
        aria-label="Add new wedding"
      >
        <Plus className="w-6 h-6" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-semibold">Add New Wedding</span>
        </div>
      </FloatingActionButton>
    </div>
  )
}
