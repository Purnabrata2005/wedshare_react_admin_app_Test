import { useEffect } from "react";
import { Route, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Share2,
  Users,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeddingHeader } from "@/components/ui/wedding-header";
import { EventScheduleCard } from "@/components/ui/eventScheduleCard";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { Navbar } from "@/components/ui/navbar";
import { ServiceCard } from "@/components/ui/serviceCard";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectWedding,
  clearSelection,
} from "@/redux/slices/weddingSlice";
import { formatDateSafe } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";
import ROUTES from "@/routePath";

export default function WeddingDetailsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedWedding, loading } = useAppSelector(
    (state) => state.weddings
  );

  const wedding = selectedWedding;

  // Redirect to dashboard if no wedding is selected
  useEffect(() => {
    if (!loading && !selectedWedding) {
      navigate('/dashboard');
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
    // TODO: Implement share functionality
    console.log("Share wedding:", wedding?.weddingId);
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
      {/* Header Section */}
      <Navbar
        title="Wedding Details"
        showBackButton
        onBackClick={handleBack}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2 bg-white/10 border-white/20 hover:bg-white/20"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            size="sm"
            onClick={handleEdit}
            className="gap-2 bg-white/20 hover:bg-white/30"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>
      </Navbar>

      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-6">
          {/* Wedding Header */}
          <div className="text-center py-8">
            <WeddingHeader
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              subtitle="Wedding Celebration"
              className="mx-auto"
            />
            {/* <Badge variant="secondary" className="mt-4">
              {wedding.invitationTemplate
                ? `Template ${wedding.invitationTemplate}`
                : "No Template Selected"}
            </Badge> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Wedding Ceremony Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Wedding Ceremony
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EventScheduleCard
                title="Wedding"
                date={weddingDate}
                location={wedding.weddingVenue || "Venue TBD"}
              />
              {/* {wedding.weddingTime && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{wedding.weddingTime}</span>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* Reception Card */}
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
                date={receptionDate}
                location={wedding.receptionVenue || "Venue TBD"}
              />
              {/* {wedding.receptionTime && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{wedding.receptionTime}</span>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>

        {/* Additional Details Section */}
        <div className="mt-8 space-y-6">
          <SectionTitle size="md">Additional Details</SectionTitle>
          {/* Quick Info Section */}
          <div className="mt-8">
            <Card className="bg-muted/50">
              <CardContent className="py-6">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-2 text-center">
                  <QuickInfoItem
                    label="Days Until Wedding"
                    value={getDaysUntilWedding(wedding.weddingDate)}
                  />
                  <QuickInfoItem
                    label="Status"
                    value={getWeddingStatus(wedding.weddingDate)}
                    valueClassName={cn(
                      isUpcoming(wedding.weddingDate)
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-8 space-y-6">
          <SectionTitle size="md">Services</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ServiceCard
              icon={<Users className="w-6 h-6" />}
              title="Invite Guests"
              description="Send invitations to your guests"
              onClick={() => navigate("/invite-guests", { state: { weddingId: wedding.weddingId } })}
            />
            <ServiceCard
              icon={<Camera className="w-6 h-6" />}
              title="Upload Photos"
              description="Share your wedding moments"
              onClick={() => navigate("/photo-upload", { state: { weddingId: wedding.weddingId } })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface QuickInfoItemProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function QuickInfoItem({ label, value, valueClassName }: QuickInfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className={cn("font-semibold text-foreground", valueClassName)}>
        {value}
      </p>
    </div>
  );
}

// Helper Functions
function getDaysUntilWedding(dateString?: string): string {
  if (!dateString) return "TBD";

  const weddingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);

  const diffTime = weddingDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays === 0) return "Today!";
  if (diffDays === 1) return "Tomorrow";
  return `${diffDays} days`;
}

function getWeddingStatus(dateString?: string): string {
  if (!dateString) return "Pending";

  const weddingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);

  if (weddingDate.getTime() < today.getTime()) return "Completed";
  if (weddingDate.getTime() === today.getTime()) return "Today";
  return "Upcoming";
}

function isUpcoming(dateString?: string): boolean {
  if (!dateString) return false;

  const weddingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);

  return weddingDate.getTime() >= today.getTime();
}
