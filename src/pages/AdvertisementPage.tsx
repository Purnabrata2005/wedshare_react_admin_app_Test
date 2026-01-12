
import { useEffect, useRef, useState } from "react";
import { Camera, Users, MapPin, Gift, Bell, Calendar, Lock, Eye,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floatingActionButton";
import { Card, CardContent } from "@/components/ui/card";
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
import { motion, useReducedMotion } from "motion/react";
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
import AuthenticatedLandingPage from "./AuthenticatedLandingPage";
import { Footer } from "@/components/layout/Footer";
import { ShuffleHero } from "@/components/shuffle-grid";
import { CardStack } from "@/components/ui/card-stack";
import { image1, image10 } from "@/assets";
import { image2 } from "@/assets";

import { FeatureCard } from "@/components/GridFeatureCards";


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
      }`}>
      {children}
    </div>
  );
}

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

const securityFeatures = [
  {
    icon: Lock,
    title: "Your Memories Are Safe",
    description: "Enterprise-grade encryption protects every photo and memory you share.",
  },
  {
    icon: Eye,
    title: "Your Privacy, Your Control",
    description: "Only share with people you choose. You control every single permission.",
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
    a: "Yes. We use enterprise-grade encryption with AES-256 for all photos and data. Your wedding details are protected with industry-standard security protocols.",
  },
  {
    q: "Can non-users access my wedding?",
    a: "Yes. You can share a link with guests—no account required. You control who can view and upload content.",
  },
  {
    q: "What encryption methods do you use?",
    a: "We use AES-256-GCM for data encryption and RSA-2048 for secure key management, ensuring your photos are protected in transit and at rest.",
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

export default function AdvertisementPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate(ROUTES.HOME);
  };

  if (isAuthenticated) {
    return <AuthenticatedLandingPage />;
  }

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Security", link: "#security" },
    { name: "FAQ", link: "#faq" },
    { name: "Updates", link: "#updates" },
  ];

  return (
    <div className="bg-background text-foreground">
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
                  className="w-56 dark:bg-wedshare-dark-surface dark:border-slate-700">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-2 py-2 text-sm border-b dark:border-slate-700">
                        <p className="font-semibold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
                          {user.fullname} 
                        </p>
                        <p className="text-xs text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer"
                        onClick={() => navigate(ROUTES.DASHBOARD)}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer"
                        onClick={() => navigate(ROUTES.PROFILE)}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("system")}>
                        System
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-red-600 dark:text-red-400"
                        onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer"
                        onClick={() => navigate(ROUTES.LOGIN)}>
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer"
                        onClick={() => navigate(ROUTES.SIGNUP)}>
                        Sign Up
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                        onClick={() => setTheme("system")}>
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
              onClose={() => setMobileMenuOpen(false)}>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className="w-full text-neutral-600 dark:text-neutral-300 text-sm"
                  onClick={() => setMobileMenuOpen(false)}>
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
                    className="w-56 dark:bg-wedshare-dark-surface dark:border-slate-700">
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-2 py-2 text-sm border-b dark:border-slate-700">
                          <p className="font-semibold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
                            {user.fullname}
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
                          }}>
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer"
                          onClick={() => {
                            navigate(ROUTES.PROFILE);
                            setMobileMenuOpen(false);
                          }}>
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("light")}>
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("dark")}>
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("system")}>
                          System
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-red-600 dark:text-red-400"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}>
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
                          }}>
                          Login
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer"
                          onClick={() => {
                            navigate(ROUTES.SIGNUP);
                            setMobileMenuOpen(false);
                          }}>
                          Sign Up
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("light")}>
                          Light
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("dark")}>
                          Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="dark:text-wedshare-dark-text-primary cursor-pointer text-xs"
                          onClick={() => setTheme("system")}>
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
                onClick={() => navigate(ROUTES.SIGNUP)}>
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

      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="flex w-full h-screen justify-center items-center">
          <ShuffleHero />
        </div>
      </section>

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
                  From photo sharing to guest management, we've got everything you need to make your wedding unforgettable.
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

            <AnimatedContainer delay={0.4} className="flex items-center justify-center">
              <CardStack
                items={[
                  {
                    id: 1,
                    image: image1,
                  },
                  {
                    id: 2,
                    image: image2 ,
                  },
                  {
                    id: 3,
                    image: image10 ,   
                  },
                ]}
              />
            </AnimatedContainer>
          </div>
        </div>
      </section>
      <section id="features" className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <AnimatedContainer className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold tracking-wide md:text-4xl lg:text-5xl">
              Key Features of WedShare
            </h2>
            <p className="text-muted-foreground mt-4 text-sm md:text-base max-w-2xl mx-auto">
              Discover the tools that make WedShare the perfect wedding planning companion.
            </p>
          </AnimatedContainer>
          <AnimatedContainer
            delay={0.4}
            className="features-grid">
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                feature={{
                  ...feature,
                  icon: (props) => <feature.icon {...props} className="feature-icon" />,
                }}
              />
            ))}
          </AnimatedContainer>
          </div>
      </section>

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
                  {/* Animated gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                      <feature.icon className="text-primary size-8 group-hover:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-foreground mb-3 text-2xl group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                  </div>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </section>

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
      <section id="faq" className="py-12 md:py-16 px-4 md:px-6 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <AnimatedContainer className="mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-center">
              Frequently Asked Questions
            </h2>
          </AnimatedContainer>

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
            <Button size="lg" onClick={() => navigate(ROUTES.SIGNUP)}>
              Get Started for Free
            </Button>
          </AnimatedContainer>
        </div>
      </section>

      <Footer />

      <FloatingActionButton
        position="bottom-right"
        size="md"
        onClick={() => navigate(ROUTES.SIGNUP)}
        className="!rounded-full !w-auto !h-auto px-6 py-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold">Get the App</span>
        </div>
      </FloatingActionButton>
    </div>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: React.ComponentProps<typeof motion.div>["className"];
  children: React.ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}>
      {children}
    </motion.div>
  );
}
