import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { QuickInfoItem } from "./QuickInfoItem";
import { cn } from "@/lib/utils";
import {
  getDaysUntilWedding,
  getWeddingStatus,
  isUpcoming,
} from "./helpers";

interface QuickInfoSectionProps {
  weddingDate?: string;
}

export function QuickInfoSection({ weddingDate }: QuickInfoSectionProps) {
  return (
    <div className="mt-8 space-y-6">
      <SectionTitle size="md">Additional Details</SectionTitle>
      <Card className="bg-muted/50">
        <CardContent className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-2 text-center">
            <QuickInfoItem
              label="Days Until Wedding"
              value={getDaysUntilWedding(weddingDate)}
            />
            <QuickInfoItem
              label="Status"
              value={getWeddingStatus(weddingDate)}
              valueClassName={cn(
                isUpcoming(weddingDate)
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}