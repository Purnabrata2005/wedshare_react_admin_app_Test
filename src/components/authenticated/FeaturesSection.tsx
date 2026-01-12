import { Camera, Users, Heart } from "lucide-react";
import { AnimatedText } from "./AnimatedText";

interface Feature {
  icon: any;
  title: string;
  description: string;
  highlight: string;
}

const FEATURES: Feature[] = [
  {
    icon: Camera,
    title: "Organize Your Memories",
    description:
      "Keep all your wedding photos and videos in one beautiful place. Share moments with guests automatically.",
    highlight: "AI-powered organization",
  },
  {
    icon: Users,
    title: "Manage Your Guests",
    description:
      "Track RSVPs, dietary preferences, and seat assignments effortlessly. Keep everyone informed with updates.",
    highlight: "Real-time collaboration",
  },
  {
    icon: Heart,
    title: "Cherish Forever",
    description:
      "Create lasting memories with high-quality storage and sharing options. Download everything anytime.",
    highlight: "Secure & private",
  },
];

export function FeaturesSection() {
  return (
    <section id="about" className="py-32 px-4 bg-wedshare-light-bg dark:bg-wedshare-dark-bg">
      <div className="max-w-6xl mx-auto">
        <AnimatedText delay={0}>
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
              Tools to make your wedding planning effortless
            </p>
          </div>
        </AnimatedText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedText key={index} delay={index * 150}>
                <div className="p-8 rounded-2xl border border-rose-200 dark:border-rose-800 hover:shadow-lg transition-all">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="inline-block px-4 py-2 bg-rose-100 dark:bg-rose-900/50 rounded-full">
                    <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                      {feature.highlight}
                    </p>
                  </div>
                </div>
              </AnimatedText>
            );
          })}
        </div>
      </div>
    </section>
  );
}