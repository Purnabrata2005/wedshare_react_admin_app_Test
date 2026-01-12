import { useState } from "react";
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
  Navbar as NavbarContainer,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";

interface NavbarProps {
  navItems?: Array<{ name: string; link: string }>;
}

export function LandingNavbar({ navItems = [] }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate(ROUTES.HOME);
  };

  const defaultNavItems = [
    { name: "Features", link: "#features" },
    { name: "Security", link: "#security" },
    { name: "FAQ", link: "#faq" },
    { name: "Updates", link: "#updates" },
  ];

  const items = navItems.length > 0 ? navItems : defaultNavItems;

  const ThemeMenu = () => (
    <>
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
  );

  const UserMenu = () => (
    <>
      <div className="px-2 py-2 text-sm border-b dark:border-slate-700">
        <p className="font-semibold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
          {user?.fullname}
        </p>
        <p className="text-xs text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
          {user?.email}
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
      <ThemeMenu />
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="dark:text-wedshare-dark-text-primary cursor-pointer text-red-600 dark:text-red-400"
        onClick={handleLogout}>
        Logout
      </DropdownMenuItem>
    </>
  );

  const GuestMenu = () => (
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
      <ThemeMenu />
    </>
  );

  const AvatarButton = () => (
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
        {isAuthenticated && user ? <UserMenu /> : <GuestMenu />}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <NavbarContainer>
        <NavBody>
          <NavbarLogo />
          <NavItems items={items} />
          <div className="hidden lg:flex gap-2">
            <AvatarButton />
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
            {items.map((item) => (
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
                      <ThemeMenu />
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
                      <ThemeMenu />
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarContainer>
    </div>
  );
}