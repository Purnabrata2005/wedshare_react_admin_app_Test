import { Card } from "@/components/ui/card"

export function WeddingCardSkeleton() {
  return (
    <Card className="bg-card border-border p-6 relative">
      {/* Menu skeleton */}
      <div className="absolute top-6 right-6 h-5 w-5 bg-muted rounded animate-pulse" />

      {/* Title skeleton */}
      <div className="h-7 bg-muted rounded-lg mb-6 w-3/4 animate-pulse" />

      <div className="space-y-4">
        {/* Date skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-primary/20 rounded animate-pulse" />
          <div className="h-5 bg-muted rounded w-32 animate-pulse" />
        </div>

        {/* Location skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-primary/20 rounded animate-pulse" />
          <div className="h-5 bg-muted rounded w-24 animate-pulse" />
        </div>
      </div>
    </Card>
  )
}

export function WeddingCardsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <WeddingCardSkeleton />
      <WeddingCardSkeleton />
      <WeddingCardSkeleton />
      <WeddingCardSkeleton />
      <WeddingCardSkeleton />
      <WeddingCardSkeleton />
      <WeddingCardSkeleton />
      <WeddingCardSkeleton />
      <WeddingCardSkeleton />
    </div>
  )
}
