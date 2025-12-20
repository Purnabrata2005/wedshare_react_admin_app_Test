import React from "react";
import { EmptyWeddingsState } from "@/components/EmptyWeddingsState";
import type { Wedding } from "@/redux/slices/weddingSlice";

interface DashboardProps {
  weddings: Wedding[];
  isLoading: boolean;
  onSelectWedding: (wedding: Wedding) => void;
  onEdit: (wedding: Wedding) => void;
  onDelete: (wedding: Wedding) => void;
}

export function Dashboard({
  weddings,
  isLoading,
  onSelectWedding,
  onEdit,
  onDelete,
}: DashboardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="space-y-4 w-full max-w-2xl">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state when no weddings
  if (weddings.length === 0) {
    return <EmptyWeddingsState onAddWedding={() => {}} />;
  }

  // Show weddings list when data exists
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Weddings</h2>
        <p className="text-muted-foreground mt-2">
          Manage and organize all your wedding events
        </p>
      </div>

      <div className="grid gap-4">
        {weddings.map((wedding) => (
          <div key={wedding.weddingId || wedding.id} className="border rounded-lg p-4">
            <h3>{wedding.brideName} & {wedding.groomName}</h3>
            <p>{wedding.weddingDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
