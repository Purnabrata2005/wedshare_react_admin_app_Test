import { Calendar, MapPin } from "lucide-react";

interface ReceptionCardProps {
  date: string;
  venue: string;
}

export function ReceptionCard({ date, venue }: ReceptionCardProps) {
  return (
    <div className="wedding-card rounded-2xl p-6">
      <div className="wedding-card-header flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <h3 className="wedding-card-title text-2xl">Reception</h3>
      </div>
      <div className="wedding-card-content">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background/60 rounded-xl p-4 flex flex-col gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              RECEPTION
            </span>
            <span className="text-lg font-semibold text-foreground">
              {date}
            </span>
          </div>
          <div className="bg-background/60 rounded-xl p-4 flex flex-col gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              LOCATION
            </span>
            <span className="text-lg font-semibold text-foreground">
              {venue || "Digha"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
