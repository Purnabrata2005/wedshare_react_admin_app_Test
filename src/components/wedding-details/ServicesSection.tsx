import { Users, Camera } from "lucide-react";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { ServiceCard } from "@/components/ui/serviceCard";

interface ServicesSectionProps {
  weddingId: string;
  onInviteGuestsClick: () => void;
  onUploadPhotosClick: () => void;
}

export function ServicesSection({
  weddingId,
  onInviteGuestsClick,
  onUploadPhotosClick,
}: ServicesSectionProps) {
  return (
    <div className="mt-8 space-y-6">
      <SectionTitle size="md">Services</SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ServiceCard
          icon={<Users className="w-6 h-6" />}
          title="Invite Guests"
          description="Send invitations to your guests"
          onClick={onInviteGuestsClick}
        />
        <ServiceCard
          icon={<Camera className="w-6 h-6" />}
          title="Upload Photos"
          description="Share your wedding moments"
          onClick={onUploadPhotosClick}
        />
      </div>
    </div>
  );
}