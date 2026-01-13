import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventScheduleCard } from "@/components/ui/eventScheduleCard";

interface ReceptionCardProps {
  date: string;
  venue: string;
}

export function ReceptionCard({ date, venue }: ReceptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Reception
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EventScheduleCard
          title="Reception"
          date={date}
          location={venue || "Venue TBD"}
        />
      </CardContent>
    </Card>
  );
}