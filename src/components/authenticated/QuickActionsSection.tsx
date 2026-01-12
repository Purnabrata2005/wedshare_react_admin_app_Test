import { Heart, Camera, Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/routePath";
import { AnimatedText } from "./AnimatedText";

interface QuickAction {
  icon: any;
  title: string;
  description: string;
  action: () => void;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: Plus,
    title: "Create Wedding",
    description: "Start planning your special day with our easy setup",
    action: () => {},
    color: "from-rose-600 to-pink-600",
  },
  {
    icon: Camera,
    title: "Gallery",
    description: "View and manage all your wedding photos",
    action: () => {},
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Guests",
    description: "Manage guests, RSVPs, and seating arrangements",
    action: () => {},
    color: "from-rose-600 to-pink-600",
  },
  {
    icon: Heart,
    title: "My Weddings",
    description: "View all your wedding events and details",
    action: () => {},
    color: "from-rose-500 to-pink-500",
  },
];

export function QuickActionsSection() {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-32 px-4 bg-gray-100 dark:bg-slate-800">
      <div className="max-w-6xl mx-auto">
        <AnimatedText delay={0}>
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-6">
              Quick Actions
            </h2>
            <p className="text-xl text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
              Everything you need to plan your wedding
            </p>
          </div>
        </AnimatedText>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {QUICK_ACTIONS.map((action, index) => {
            const Icon = action.icon;
            return (
              <AnimatedText key={index} delay={index * 100}>
                <div
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  className="p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 border border-rose-200 dark:border-rose-800">
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-3">
                    {action.title}
                  </h3>
                  <p className="text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </AnimatedText>
            );
          })}
        </div>
      </div>
    </section>
  );
}