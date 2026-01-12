import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import ROUTES from "@/routePath";
import { useNavigate } from "react-router-dom";
import { AnimatedBlock } from "./AnimatedBlock";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="min-h-min flex items-center justify-center px-6 sm:px-8 pt-40 pb-24 sm:pt-44 sm:pb-28 md:px-10 md:pt-28 md:pb-20">
      <AnimatedBlock>
        <div className="max-w-5xl text-center space-y-10">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            Your Love Story,
            <br />
            <FlipWords
              words={[
                "Perfectly Captured",
                "Forever Cherished",
                "Beautifully Shared",
              ]}
              className="text-3xl sm:text-3xl md:text-6xl lg:text-7xl font-bold text-primary"
            />
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Plan, organize, and celebrate your wedding with everyone who
            matters.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="custom"
              className="text-lg font-bold"
              onClick={() => navigate(ROUTES.LOGIN)}>
              Start Planning
            </Button>
            <Button
              size="custom"
              className="text-lg font-bold"
              variant="outline"
              onClick={() => navigate(ROUTES.LOGIN)}>
              Explore Features
            </Button>
          </div>
        </div>
      </AnimatedBlock>
    </section>
  );
}