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
import { useAppDispatch } from "@/redux/hooks";
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

interface AuthenticatedNavbarProps {
  user: any;
}

export function AuthenticatedNavbar({ user }: AuthenticatedNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { name: "Create Wedding", link: "#features" },
    { name: "Features", link: "#about" },
  ];

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

  const UserDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center outline-none">
          <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "guest"}`}
            />
            <AvatarFallback className="bg-wedshare-light-primary dark:bg-wedshare-dark-primary text-white">
              {user?.fullname?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 dark:bg-wedshare-dark-surface dark:border-slate-700">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MobileUserDropdown = () => (
    <div className="flex justify-center w-full pt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center outline-none">
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "guest"}`}
              />
              <AvatarFallback className="bg-wedshare-light-primary dark:bg-wedshare-dark-primary text-white">
                {user?.fullname?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-56 dark:bg-wedshare-dark-surface dark:border-slate-700">
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="hidden lg:flex gap-2">
            <UserDropdown />
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
            <MobileUserDropdown />
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}