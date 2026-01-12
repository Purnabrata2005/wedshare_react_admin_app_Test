import { useAppSelector } from "@/redux/hooks";
import ROUTES from "@/routePath";
import { useNavigate } from "react-router-dom";
import AuthenticatedLandingPage from "./AuthenticatedLandingPage";
import { Footer } from "@/components/layout/Footer";
import { ShuffleHero } from "@/components/shuffle-grid";
import { FloatingActionButton } from "@/components/ui/floatingActionButton";

// Import landing components
import { LandingNavbar } from "@/components/Landing/LandingNavbar";
import { HeroSection } from "@/components/Landing/HeroSection";
import { FeaturesShowcase } from "@/components/Landing/FeaturesShowcase";
import { FeaturesGrid } from "@/components/Landing/FeaturesGrid";
import { SecuritySection } from "@/components/Landing/SecuritySection";
import { UpdatesSection } from "@/components/Landing/UpdatesSection";
import { FAQSection } from "@/components/Landing/FAQSection";
import { CTASection } from "@/components/Landing/CTASection";

export default function AdvertisementPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <AuthenticatedLandingPage />;
  }

  return (
    <div className="bg-background text-foreground">
      <LandingNavbar />

      <HeroSection />

      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="flex w-full h-screen justify-center items-center">
          <ShuffleHero />
        </div>
      </section>

      <FeaturesShowcase />
      <FeaturesGrid />
      <SecuritySection />
      <UpdatesSection />
      <FAQSection />
      <CTASection />

      <Footer />

      <FloatingActionButton
        position="bottom-right"
        size="md"
        onClick={() => navigate(ROUTES.SIGNUP)}
        className="!rounded-full !w-auto !h-auto px-6 py-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold">Get the App</span>
        </div>
      </FloatingActionButton>
    </div>
  );
}