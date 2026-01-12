import { useNavigate } from "react-router-dom";
import ROUTES from "@/routePath";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "./AnimatedText";

interface HeroSectionProps {
  userName: string;
}

export function AuthenticatedHeroSection({ userName }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-wedshare-light-bg dark:bg-wedshare-dark-bg flex items-center justify-center px-4 py-20 mt-16">
      <div className="max-w-5xl mx-auto text-center">
        <AnimatedText delay={0}>
          <h1 className="text-6xl md:text-8xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-6 leading-tight tracking-tight">
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-bold text-5xl md:text-7xl">
              {userName}! 💕
            </span>
          </h1>
        </AnimatedText>

        <AnimatedText delay={200}>
          <p className="text-xl md:text-2xl text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Your wedding journey is just beginning. Let's create beautiful
            memories together with your loved ones.
          </p>
        </AnimatedText>

        <AnimatedText delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              size="custom"
              className="text-lg font-bold">
              Go to Dashboard
            </Button>
            <Button
              onClick={() => navigate(ROUTES.PROFILE)}
              variant="outline"
              size="custom"
              className="text-lg font-bold">
              View Profile
            </Button>
          </div>
        </AnimatedText>
      </div>
    </section>
  );
}