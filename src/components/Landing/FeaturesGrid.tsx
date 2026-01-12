import { Camera, Users, MapPin, Gift, Calendar, Bell } from "lucide-react";
import { FeatureCard } from "@/components/GridFeatureCards";
import { AnimatedContainer } from "./AnimatedContainer";

const features = [
  {
    icon: Camera,
    title: "Guest Photo Gallery",
    description: "Guests upload photos and videos directly.",
    reverse: false,
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "RSVPs, preferences, and seating in one place.",
    reverse: true,
  },
  {
    icon: MapPin,
    title: "Venue & Timeline",
    description: "Share location and wedding schedule.",
    reverse: false,
  },
  {
    icon: Gift,
    title: "Wedding Registry",
    description: "Create and manage your wishlist.",
    reverse: true,
  },
  {
    icon: Calendar,
    title: "Event Schedule",
    description: "Keep guests updated with ceremonies and event timings.",
    reverse: false,
  },
  {
    icon: Bell,
    title: "Guest Notifications",
    description: "Send instant updates and reminders to all guests.",
    reverse: true,
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedContainer className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-wide md:text-4xl lg:text-5xl">
            Key Features of WedShare
          </h2>
          <p className="text-muted-foreground mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Discover the tools that make WedShare the perfect wedding planning
            companion.
          </p>
        </AnimatedContainer>
        <AnimatedContainer delay={0.4} className="features-grid">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              feature={{
                ...feature,
                icon: (props) => (
                  <feature.icon {...props} className="feature-icon" />
                ),
              }}
            />
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
}