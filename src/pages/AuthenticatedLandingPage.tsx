import { useAppSelector } from "@/redux/hooks";
import { AuthenticatedNavbar } from "@/components/authenticated/AuthenticatedNavbar";
import { AuthenticatedHeroSection } from "@/components/authenticated/HeroSection";
import { QuickActionsSection } from "@/components/authenticated/QuickActionsSection";
import { FeaturesSection } from "@/components/authenticated/FeaturesSection";
import { AuthenticatedCTASection } from "@/components/authenticated/CTASection";
import { AuthenticatedFooter } from "@/components/authenticated/Footer";

export default function AuthenticatedLandingPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="bg-wedshare-light-bg dark:bg-wedshare-dark-bg">
      <AuthenticatedNavbar user={user} />
      <AuthenticatedHeroSection userName={user?.fullname || "User"} />
      <QuickActionsSection />
      <FeaturesSection />
      <AuthenticatedCTASection />
      <AuthenticatedFooter />
    </div>
  );
}