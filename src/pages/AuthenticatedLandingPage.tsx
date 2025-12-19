"use client";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/authSlice";
import ROUTES from "@/routePath";
import { useState, useEffect, useRef } from "react";
import { Heart, Camera, Users, Plus } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";

interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

export default function AuthenticatedLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { name: "Create Wedding", link: "#features" },
    { name: "Features", link: "#about" },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: "Create Wedding",
      description: "Start planning your special day with our easy setup",
      action: () => navigate(ROUTES.DASHBOARD),
      color: "from-rose-600 to-pink-600"
    },
    {
      icon: Camera,
      title: "Gallery",
      description: "View and manage all your wedding photos",
      action: () => navigate(ROUTES.DASHBOARD),
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Guests",
      description: "Manage guests, RSVPs, and seating arrangements",
      action: () => navigate(ROUTES.DASHBOARD),
      color: "from-rose-600 to-pink-600"
    },
    {
      icon: Heart,
      title: "My Weddings",
      description: "View all your wedding events and details",
      action: () => navigate(ROUTES.DASHBOARD),
      color: "from-rose-500 to-pink-500"
    }
  ];

  const features = [
    {
      icon: Camera,
      title: "Organize Your Memories",
      description: "Keep all your wedding photos and videos in one beautiful place. Share moments with guests automatically.",
      highlight: "AI-powered organization"
    },
    {
      icon: Users,
      title: "Manage Your Guests",
      description: "Track RSVPs, dietary preferences, and seat assignments effortlessly. Keep everyone informed with updates.",
      highlight: "Real-time collaboration"
    },
    {
      icon: Heart,
      title: "Cherish Forever",
      description: "Create lasting memories with high-quality storage and sharing options. Download everything anytime.",
      highlight: "Secure & private"
    }
  ];

  return (
    <div className="bg-wedshare-light-bg dark:bg-wedshare-dark-bg">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="hidden lg:flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center outline-none">
                    <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'guest'}`}
                      />
                      <AvatarFallback className="bg-wedshare-light-primary dark:bg-wedshare-dark-primary text-white">
                        {user?.fullname?.[0]?.toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 dark:bg-wedshare-dark-surface dark:border-slate-700">
                  <div className="px-2 py-2 text-sm border-b dark:border-slate-700">
                    <p className="font-semibold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
                      {user?.fullname}
                    </p>
                    <p className="text-xs text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer" onClick={() => navigate(ROUTES.DASHBOARD)}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer" onClick={() => navigate(ROUTES.PROFILE)}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs" onClick={() => setTheme("light")}>
                    🌙 Light
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs" onClick={() => setTheme("dark")}>
                    ☀️ Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs" onClick={() => setTheme("system")}>
                    🖥️ System
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer text-red-600 dark:text-red-400" onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </NavBody>

          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
            </MobileNavHeader>
            <MobileNavMenu
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            >
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className="w-full text-neutral-600 dark:text-neutral-300 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex justify-center w-full pt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center outline-none">
                      <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'guest'}`} />
                        <AvatarFallback className="bg-wedshare-light-primary dark:bg-wedshare-dark-primary text-white">
                          {user?.fullname?.[0]?.toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 dark:bg-wedshare-dark-surface dark:border-slate-700">
                    <div className="px-2 py-2 text-sm border-b dark:border-slate-700">
                      <p className="font-semibold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
                        {user?.fullname}
                      </p>
                      <p className="text-xs text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer" onClick={() => {
                      navigate(ROUTES.DASHBOARD);
                      setMobileMenuOpen(false);
                    }}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer" onClick={() => {
                      navigate(ROUTES.PROFILE);
                      setMobileMenuOpen(false);
                    }}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs" onClick={() => setTheme("light")}>
                      🌙 Light
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs" onClick={() => setTheme("dark")}>
                      ☀️ Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs" onClick={() => setTheme("system")}>
                      🖥️ System
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="dark:text-wedshare-dark-text-primary cursor-pointer text-red-600 dark:text-red-400" onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>
      {/* Hero Section */}
      <section className="min-h-screen bg-wedshare-light-bg dark:bg-wedshare-dark-bg flex items-center justify-center px-4 py-20 mt-16">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedText delay={0}>
            <h1 className="text-6xl md:text-8xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-6 leading-tight tracking-tight">
              Welcome back,
              <br />
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-bold text-5xl md:text-7xl">
                {user?.fullname}! 💕
              </span>
            </h1>
          </AnimatedText>

          <AnimatedText delay={200}>
            <p className="text-xl md:text-2xl text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Your wedding journey is just beginning. Let's create beautiful memories together with your loved ones.
            </p>
          </AnimatedText>

          <AnimatedText delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="px-10 py-4 bg-rose-600 dark:bg-rose-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(ROUTES.PROFILE)}
                className="px-10 py-4 border-2 border-wedshare-light-primary dark:border-wedshare-dark-primary text-wedshare-light-primary dark:text-wedshare-dark-primary font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-lg"
              >
                View Profile
              </button>
            </div>
          </AnimatedText>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section id="features" className="py-32 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <AnimatedText delay={0}>
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-6">Quick Actions</h2>
              <p className="text-xl text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">Everything you need to plan your wedding</p>
            </div>
          </AnimatedText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <AnimatedText key={index} delay={index * 100}>
                  <div
                    onClick={action.action}
                    className="p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 border border-rose-200 dark:border-rose-800"
                  >
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-3">{action.title}</h3>
                    <p className="text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary leading-relaxed">{action.description}</p>
                  </div>
                </AnimatedText>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-32 px-4 bg-wedshare-light-bg dark:bg-wedshare-dark-bg">
        <div className="max-w-6xl mx-auto">
          <AnimatedText delay={0}>
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-6">Everything You Need</h2>
              <p className="text-xl text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">Tools to make your wedding planning effortless</p>
            </div>
          </AnimatedText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <AnimatedText key={index} delay={index * 150}>
                  <div className="p-8 rounded-2xl border border-rose-200 dark:border-rose-800 hover:shadow-lg transition-all">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-4">{feature.title}</h3>
                    <p className="text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary mb-4 leading-relaxed">{feature.description}</p>
                    <div className="inline-block px-4 py-2 bg-rose-100 dark:bg-rose-900/50 rounded-full">
                      <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">{feature.highlight}</p>
                    </div>
                  </div>
                </AnimatedText>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-32 px-4 bg-slate-50 dark:bg-slate-900">
        <AnimatedText delay={0}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary mb-12">
              Explore your dashboard and start planning your perfect wedding
            </p>
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="px-10 py-4 text-lg bg-rose-600 dark:bg-rose-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Open Dashboard
            </button>
          </div>
        </AnimatedText>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-wedshare-light-bg dark:bg-wedshare-dark-bg border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary text-sm">&copy; 2025 WedShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
