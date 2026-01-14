import { Calendar, MapPin } from "lucide-react";

interface ReceptionCardProps {
  date: string;
  venue: string;
}

export function ReceptionCard({ date, venue }: ReceptionCardProps) {
  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-card-icon">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="event-card-title">Reception</h3>
      </div>
      <div className="event-card-content">
        <div className="event-info-grid">
          <div className="event-info-item">
            <div className="event-info-icon">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="event-info-label">Reception</span>
            <span className="event-info-value">{date}</span>
          </div>
          <div className="event-info-item">
            <div className="event-info-icon">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="event-info-label">Location</span>
            <span className="event-info-value">{venue || "Venue TBD"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
