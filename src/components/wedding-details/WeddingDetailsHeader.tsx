import { ArrowLeft, Edit, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { WeddingHeader } from "@/components/ui/wedding-header";

interface WeddingDetailsHeaderProps {
  brideName: string;
  groomName: string;
  onBackClick: () => void;
  onEditClick: () => void;
  onShareClick: () => void;
}

export function WeddingDetailsHeader({
  brideName,
  groomName,
  onBackClick,
  onEditClick,
  onShareClick,
}: WeddingDetailsHeaderProps) {
  return (
    <>
      <Navbar
        title="Wedding Details"
        showBackButton
        onBackClick={onBackClick}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShareClick}
            className="gap-2 bg-white/10 border-white/20 hover:bg-white/20"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            size="sm"
            onClick={onEditClick}
            className="gap-2 bg-white/20 hover:bg-white/30"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>
      </Navbar>

      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-8">
            <WeddingHeader
              brideName={brideName}
              groomName={groomName}
              subtitle="Wedding Celebration"
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
}