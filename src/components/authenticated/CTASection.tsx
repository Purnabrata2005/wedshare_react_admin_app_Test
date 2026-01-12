import { useNavigate } from "react-router-dom";
import ROUTES from "@/routePath";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "./AnimatedText";

export function AuthenticatedCTASection() {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-32 px-4 bg-slate-50 dark:bg-slate-900">
      <AnimatedText delay={0}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary mb-12">
            Explore your dashboard and start planning your perfect wedding
          </p>
          <Button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            size="lg"
            className="text-lg font-bold">
            Open Dashboard
          </Button>
        </div>
      </AnimatedText>
    </section>
  );
}