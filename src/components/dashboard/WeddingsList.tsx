import { WeddingCard } from "@/components/WeddingCard"
import type { Wedding } from "@/redux/slices/weddingSlice"

interface WeddingsListProps {
  weddings: Wedding[]
  onSelectWedding: (wedding: Wedding) => void
  onEditWedding: (wedding: Wedding) => void
}

export function WeddingsList({ weddings, onSelectWedding, onEditWedding }: WeddingsListProps) {
  return (
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
        {weddings
          .filter((wedding) => wedding != null) // Filter out null/undefined weddings
          .map((wedding) => (
            <WeddingCard
              key={wedding.weddingId || wedding.id}
              wedding={wedding}
              onClick={onSelectWedding}
              onEdit={onEditWedding}
            />
          ))
        }
      </div>
    </div>
  )
}