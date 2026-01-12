import { Badge } from "@/components/ui/badge";
import { CardStack } from "@/components/ui/card-stack";
import { image1, image2, image10 } from "@/assets";
import {AnimatedContainer}  from "./AnimatedContainer";

export function FeaturesShowcase() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedContainer className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-wide md:text-4xl lg:text-5xl">
            Everything for Your Wedding
          </h2>
          <p className="text-muted-foreground mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Simple, beautiful, and powerful tools to manage your big day.
          </p>
        </AnimatedContainer>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
          <AnimatedContainer delay={0.2} className="flex-1 max-w-md space-y-6">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Core Features
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold">
                Built for couples who want it all
              </h3>
              <p className="text-muted-foreground">
                From photo sharing to guest management, we've got everything you
                need to make your wedding unforgettable.
              </p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">Secure photo sharing</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">Easy guest management</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">Shareable event timeline</span>
              </li>
            </ul>
          </AnimatedContainer>

          <AnimatedContainer
            delay={0.4}
            className="flex items-center justify-center">
            <CardStack
              items={[
                { id: 1, image: image1 },
                { id: 2, image: image2 },
                { id: 3, image: image10 },
              ]}
            />
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
}