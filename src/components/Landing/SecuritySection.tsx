import { Lock, Eye } from "lucide-react";
import { AnimatedContainer } from "./AnimatedContainer";

const securityFeatures = [
  {
    icon: Lock,
    title: "Your Memories Are Safe",
    description:
      "Enterprise-grade encryption protects every photo and memory you share.",
  },
  {
    icon: Eye,
    title: "Your Privacy, Your Control",
    description:
      "Only share with people you choose. You control every single permission.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedContainer className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            A safe home for your memories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your wedding moments deserve the best protection.
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityFeatures.map((feature, i) => (
            <AnimatedContainer key={i} delay={i * 0.2}>
              <div className="group relative p-8 md:p-10 rounded-2xl border-2 border-primary/20 bg-card overflow-hidden transition-all duration-500 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <feature.icon
                      className="text-primary size-8 group-hover:rotate-12 transition-transform duration-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-bold text-foreground mb-3 text-2xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}