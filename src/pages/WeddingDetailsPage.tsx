import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { clearSelection, loadWeddingsRequest, selectWedding } from "@/redux/slices/weddingSlice"
import { Calendar, Plus } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import { EmptyWeddingsState } from "@/components/EmptyWeddingsState"
import { FloatingActionButton } from "@/components/ui/floatingActionButton"
import { AvatarDropdown } from "@/components/dashboard/AvatarDropdown"
import { WeddingsList } from "@/components/dashboard/WeddingsList"
import { ErrorAlert } from "@/components/dashboard/ErrorAlert"
import { DashboardLoading } from "@/components/dashboard/DashboardLoading"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import type { Wedding } from "@/redux/slices/weddingSlice"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { weddings, loading, error } = useAppSelector((state) => state.weddings)

  useEffect(() => {
    dispatch(loadWeddingsRequest())
  }, [dispatch])

  const handleSelectWedding = (wedding: Wedding) => {
    console.log("Selected wedding:", wedding)
  }

  const handleEditWedding = (wedding: Wedding) => {
    dispatch(selectWedding(wedding))
    navigate('/add-wedding')
  }

  const handleAddWedding = () => {
    dispatch(clearSelection())
    navigate('/add-wedding')
  }

  if (loading) {
    return <DashboardLoading />
  }

  return (
    <div className="min-h-screen bg-wedshare-light-bg dark:bg-wedshare-dark-bg transition-colors">
      <Navbar
        icon={Calendar}
        title="Your Weddings"
        subtitle={weddings.length > 0 ? `${weddings.length} wedding${weddings.length !== 1 ? 's' : ''} registered` : "Create your first wedding"}
      >
        <AvatarDropdown />
      </Navbar>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {error && <ErrorAlert error={error} />}

        {weddings.length === 0 && !loading ? (
          <EmptyWeddingsState onAddWedding={handleAddWedding} />
        ) : (
          <WeddingsList
            weddings={weddings}
            onSelectWedding={handleSelectWedding}
            onEditWedding={handleEditWedding}
          />
        )}
      </main>

      <Outlet />

      <FloatingActionButton
        position="bottom-right"
        size="md"
        onClick={handleAddWedding}
        className="rounded-full! w-auto! h-auto! px-6 py-3"
        aria-label="Add new wedding"
      >
        <Plus className="w-6 h-6" />
        <span className="text-lg font-semibold">Add New Wedding</span>
      </FloatingActionButton>
    </div>
  )
}