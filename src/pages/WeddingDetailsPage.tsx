import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectWedding,
  clearSelection,
} from "@/redux/slices/weddingSlice";
import { formatDateSafe } from "@/lib/dateUtils";
import ROUTES from "@/routePath";
import { WeddingDetailsHeader } from "@/components/wedding-details/WeddingDetailsHeader";
import { WeddingCeremonyCard } from "@/components/wedding-details/WeddingCeremonyCard";
import { ReceptionCard } from "@/components/wedding-details/ReceptionCard";
import { QuickInfoSection } from "@/components/wedding-details/QuickInfoSection";
import { ServicesSection } from "@/components/wedding-details/ServicesSection";

export default function WeddingDetailsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedWedding, loading } = useAppSelector(
    (state) => state.weddings
  );

  const wedding = selectedWedding;

  useEffect(() => {
    if (!loading && !selectedWedding) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [selectedWedding, loading, navigate]);

  const handleBack = () => {
    dispatch(clearSelection());
    navigate(ROUTES.DASHBOARD);
  };

  const handleEdit = () => {
    if (wedding) {
      dispatch(selectWedding(wedding));
      navigate(ROUTES.ADD_WEDDING);
    }
  };

  const handleShare = () => {
    console.log("Share wedding:", wedding?.weddingId);
  };

  const handleInviteGuests = () => {
    navigate("/invite-guests", { state: { weddingId: wedding?.weddingId } });
  };

  const handleUploadPhotos = () => {
    navigate("/photo-upload", { state: { weddingId: wedding?.weddingId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Wedding not found</p>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const weddingDate = formatDateSafe(wedding.weddingDate);
  const receptionDate = formatDateSafe(wedding.receptionDate);

  return (
    <div className="min-h-screen bg-background">
      <WeddingDetailsHeader
        brideName={wedding.brideName}
        groomName={wedding.groomName}
        onBackClick={handleBack}
        onEditClick={handleEdit}
        onShareClick={handleShare}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <WeddingCeremonyCard
            date={weddingDate}
            venue={wedding.weddingVenue}
          />
          <ReceptionCard date={receptionDate} venue={wedding.receptionVenue} />
        </div>

        <QuickInfoSection weddingDate={wedding.weddingDate} />

        <ServicesSection
          weddingId={wedding.weddingId}
          onInviteGuestsClick={handleInviteGuests}
          onUploadPhotosClick={handleUploadPhotos}
        />
      </div>
    </div>
  );
}