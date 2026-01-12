import { Button } from "@/components/ui/button";
import ROUTES from "@/routePath";
import { useNavigate } from "react-router-dom";
import { AnimatedContainer } from "./AnimatedContainer";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
        <AnimatedContainer>
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to plan your wedding?
          </h2>
        </AnimatedContainer>
        <AnimatedContainer delay={0.2}>
          <p className="text-muted-foreground text-lg md:text-xl">
            Join thousands of couples creating their perfect story.
          </p>
        </AnimatedContainer>
        <AnimatedContainer delay={0.4}>
          <Button size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
            Get Started for Free
          </Button>
        </AnimatedContainer>
      </div>
    </section>
  );
}