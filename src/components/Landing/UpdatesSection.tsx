import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedContainer } from "./AnimatedContainer";

const updates = [
  {
    date: "Dec 2024",
    title: "AI Photo Enhancement",
    desc: "Automatic photo improvements.",
  },
  {
    date: "Nov 2024",
    title: "Guest Collaboration",
    desc: "Live guest contributions.",
  },
  { date: "Oct 2024", title: "Mobile App", desc: "iOS & Android launch." },
];

export function UpdatesSection() {
  return (
    <section id="updates" className="py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedContainer className="mb-8 md:mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            The latest from WedShare
          </h2>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {updates.map((u, index) => (
            <AnimatedContainer key={u.title} delay={index * 0.1}>
              <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-5 md:p-6 space-y-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30">
                    {u.date}
                  </Badge>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {u.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {u.desc}
                  </p>
                  <div className="pt-2">
                    <div className="w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}