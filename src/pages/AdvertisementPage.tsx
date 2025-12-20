"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Users,
  MapPin,
  Gift,
  Heart,
  Sparkles,
  Share2,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floatingActionButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useTheme } from "@/components/layout/theme-provider";
import { logoutAction } from "@/redux/slices/authSlice";
import ROUTES from "@/routePath";
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

import { FlipWords } from "@/components/ui/shadcn-io/flip-words/index";
import Footer from "@/components/layout/Footer";
import AuthenticatedLandingPage from "./AuthenticatedLandingPage";

/* -----------------------------
   Simple scroll animation
------------------------------ */
function AnimatedBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        entry.isIntersecting && setTimeout(() => setVisible(true), delay),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

/* -----------------------------
   Page Data
------------------------------ */
const benefits = [
  {
    icon: Heart,
    title: "Cherish Memories",
    description: "Preserve every moment forever.",
  },
  {
    icon: Sparkles,
    title: "AI Organization",
    description: "Automatic photo grouping.",
  },
  { icon: Share2, title: "Easy Sharing", description: "Share without apps." },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Encrypted & protected.",
  },
];

const features = [
  {
    icon: Camera,
    title: "Guest Photo Gallery",
    description: "Guests upload photos and videos directly.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900",
    reverse: false,
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "RSVPs, preferences, and seating in one place.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900",
    reverse: true,
  },
  {
    icon: MapPin,
    title: "Venue & Timeline",
    description: "Share location and wedding schedule.",
    image: "https://images.unsplash.com/photo-1519225421180-fbb5a32266cc?w=900",
    reverse: false,
  },
  {
    icon: Gift,
    title: "Wedding Registry",
    description: "Create and manage your wishlist.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900",
    reverse: true,
  },
];

const faqs = [
  {
    q: "How do I create a wedding?",
    a: "Sign up, click Create Wedding, and fill in your details.",
  },
  {
    q: "Can guests upload photos?",
    a: "Yes. Guests can upload photos and videos easily.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use enterprise-grade encryption.",
  },
  {
    q: "Can non-users access my wedding?",
    a: "Yes. Share a link—no account required.",
  },
];

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

/* -----------------------------
   Page Component
------------------------------ */
export default function AdvertisementPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!token && !!user;

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate(ROUTES.LOGIN);
  };

  // If user is authenticated, show the authenticated landing page
  if (isAuthenticated) {
    return <AuthenticatedLandingPage />;
  }

  // Otherwise, show the public advertisement page

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "FAQ", link: "#faq" },
    { name: "Updates", link: "#updates" },
  ];

  return (
    <div className="bg-background text-foreground">
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
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                          user?.email || "guest"
                        }`}
                      />
                      <AvatarFallback className="bg-wedshare-light-primary dark:bg-wedshare-dark-primary text-white">
                        {user?.fullname?.[0]?.toUpperCase() || "G"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 dark:bg-wedshare-dark-surface dark:border-slate-700"
                >
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-2 py-2 text-sm border-b dark:border-slate-700">
                        <p className="font-semibold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
                          {user.fullname} {user.lastName}
                        </p>
                        <p className="text-xs text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer"
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                      >
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer"
                        onClick={() => navigate(ROUTES.PROFILE)}
                      >
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("light")}
                      >
                        🌙 Light
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("dark")}
                      >
                        ☀️ Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("system")}
                      >
                        🖥️ System
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-red-600 dark:text-red-400"
                        onClick={handleLogout}
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer"
                        onClick={() => navigate(ROUTES.LOGIN)}
                      >
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer"
                        onClick={() => navigate(ROUTES.SIGNUP)}
                      >
                        Sign Up
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("light")}
                      >
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("dark")}
                      >
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("system")}
                      >
                        System
                      </DropdownMenuItem>
                    </>
                  )}
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
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                            user?.email || "guest"
                          }`}
                        />
                        <AvatarFallback className="bg-wedshare-light-primary dark:bg-wedshare-dark-primary text-white">
                          {user?.fullname?.[0]?.toUpperCase() || "G"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-56 dark:bg-wedshare-dark-surface dark:border-slate-700"
                  >
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-2 py-2 text-sm border-b dark:border-slate-700">
                          <p className="font-semibold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
                            {user.fullname} {user.lastName}
                          </p>
                          <p className="text-xs text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
                            {user.email}
                          </p>
                        </div>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer"
                          onClick={() => {
                            navigate(ROUTES.DASHBOARD);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer"
                          onClick={() => {
                            navigate(ROUTES.PROFILE);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("light")}
                        >
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("dark")}
                        >
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("system")}
                        >
                          System
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-red-600 dark:text-red-400"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer"
                          onClick={() => {
                            navigate(ROUTES.LOGIN);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Login
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer"
                          onClick={() => {
                            navigate(ROUTES.SIGNUP);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign Up
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("light")}
                        >
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("dark")}
                        >
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("system")}
                        >
                          System
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>
      <section className="min-h-screen flex items-center justify-center px-6 pt-32">
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
                  "Eternally Remembered",
                ]}
                className="text-primary"
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
                onClick={() => console.log("Navigate to signup")}
              >
                Start Planning
              </Button>
              <Button
                size="custom"
                className="text-lg font-bold"
                variant="outline"
                onClick={() => console.log("Navigate to login")}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </AnimatedBlock>
      </section>

      {/* BENEFITS */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedBlock>
            <h2 className="text-5xl font-bold text-center mb-20">
              Get more from every memory
            </h2>
          </AnimatedBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <AnimatedBlock key={b.title} delay={i * 100}>
                  <Card className="text-center">
                    <CardHeader>
                      <Icon className="mx-auto h-10 w-10 text-primary" />
                      <CardTitle>{b.title}</CardTitle>
                      <CardDescription>{b.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </AnimatedBlock>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6 bg-muted/40">
        <div className="max-w-6xl mx-auto space-y-32">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <AnimatedBlock key={f.title} delay={i * 150}>
                <div
                  className={`flex flex-col ${
                    f.reverse ? "md:flex-row-reverse" : "md:flex-row"
                  } gap-16 items-center`}
                >
                  <div className="flex-1 space-y-6">
                    <Icon className="h-10 w-10 text-primary" />
                    <h3 className="text-4xl font-bold">{f.title}</h3>
                    <p className="text-muted-foreground text-lg">
                      {f.description}
                    </p>
                    <Button
                      size="xl"
                      className="text-lg font-bold"
                      onClick={() => console.log("Learn more clicked")}
                    >
                      Learn More
                    </Button>
                  </div>

                  <div className="flex-1">
                    <img
                      src={f.image}
                      alt={f.title}
                      className="rounded-3xl shadow-2xl h-96 w-full object-cover"
                    />
                  </div>
                </div>
              </AnimatedBlock>
            );
          })}
        </div>
      </section>

      {/* UPDATES */}
      <section id="updates" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20">
            The latest from WedShare
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {updates.map((u) => (
              <Card key={u.title}>
                <CardContent className="space-y-4 pt-6">
                  <Badge>{u.date}</Badge>
                  <h3 className="text-xl font-bold">{u.title}</h3>
                  <p className="text-muted-foreground">{u.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-20">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold">Ready to plan your wedding?</h2>
          <p className="text-muted-foreground text-xl">
            Join thousands of couples creating their perfect story.
          </p>
          <Button size="lg" onClick={() => console.log("Get started clicked")}>
            Get Started for Free
          </Button>
        </div>
      </section>

      <Footer />

      <FloatingActionButton
        position="bottom-right"
        size="md"
        onClick={() => console.log("Create wedding clicked")}
        className="!rounded-full !w-auto !h-auto px-6 py-3"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold">Get the App</span>
        </div>
      </FloatingActionButton>
    </div>
  );
}
