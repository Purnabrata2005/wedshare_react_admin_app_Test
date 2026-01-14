import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { clearSelection } from "@/redux/slices/weddingSlice"
import { Calendar, Plus } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import { EmptyWeddingsState } from "@/components/EmptyWeddingsState"
import { FloatingActionButton } from "@/components/ui/floatingActionButton"
import { AvatarDropdown } from "@/components/dashboard/AvatarDropdown"
import { DashboardLoading } from "@/components/dashboard/DashboardLoading"
import { ErrorAlert } from "@/components/dashboard/ErrorAlert"
import { WeddingsList } from "@/components/dashboard/WeddingsList"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { loadWeddingsRequest, selectWedding } from "@/redux/slices/weddingSlice"
import type { Wedding } from "@/redux/slices/weddingSlice"
import ROUTES from "@/routePath"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { weddings, loading, error } = useAppSelector((state) => state.weddings)
  const { rehydrated } = useAppSelector((state) => state.auth)

  // Load weddings on component mount or when rehydration completes
  useEffect(() => {
    if (rehydrated) {
      dispatch(loadWeddingsRequest())
    }
  }, [dispatch, rehydrated])

  const handleSelectWedding = (wedding: Wedding | null | undefined) => {
    if (!wedding) return
    console.log("Wedding selected:", wedding)
    const weddingId = wedding?.weddingId || wedding?.id
    if (weddingId) {
      dispatch(selectWedding(weddingId))
      navigate(ROUTES.WEDDING_DETAILS)
    }
  }

  const handleEditWedding = (wedding: Wedding | null | undefined) => {
    if (!wedding) return
    const weddingId = wedding?.weddingId || wedding?.id
    if (weddingId) {
      dispatch(selectWedding(weddingId))
      navigate(ROUTES.ADD_WEDDING)
    }
  }

  const handleAddWedding = () => {
    dispatch(clearSelection());
    navigate(ROUTES.ADD_WEDDING);
  }

  // Handle navigation back from ADD_WEDDING - reload weddings
  useEffect(() => {
    const handlePopState = () => {
      dispatch(loadWeddingsRequest())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [dispatch])

  // Loading State
  if (loading || !rehydrated) {
    return <DashboardLoading />
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
        {error && <ErrorAlert error={error} />}

        {/* Empty State */}
        {weddings.length === 0 && !loading ? (
          <EmptyWeddingsState onAddWedding={handleAddWedding} />
        ) : (
          /* Weddings Grid */
          <WeddingsList 
            weddings={weddings}
            onSelectWedding={handleSelectWedding}
            onEditWedding={handleEditWedding}
          />
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
