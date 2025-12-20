
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar } from "lucide-react";

interface EmptyWeddingsStateProps {
  onAddWedding: () => void;
}

export function EmptyWeddingsState({ }: EmptyWeddingsStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[600px] px-4 py-12">
      <Card className="w-full max-w-md border-2 border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">No Weddings Registered Yet</CardTitle>
          <CardDescription className="mt-2 text-base">
            Start managing your event by adding your first wedding!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Create Your First Wedding</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add bride & groom names, dates, venues, and manage all wedding details
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
