import { useNavigate } from "react-router-dom"
import { LogOut, Settings, User, Moon, Sun } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/components/layout/theme-provider"
import { useAppSelector } from "@/redux/hooks"

export function AvatarDropdown() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { user } = useAppSelector((state) => state.auth)

  const getAvatarFallback = () => {
    if (!user) return "U"
    const firstName = user.fullname?.charAt(0) || ""
    return firstName.toUpperCase() || "U"
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer rounded-full hover:ring-2 hover:ring-wedshare-light-primary/50 dark:hover:ring-wedshare-dark-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-wedshare-light-primary/50 dark:focus:ring-wedshare-dark-primary/50">
          <Avatar className="h-10 w-10 ring-2 ring-wedshare-light-primary/30 dark:ring-wedshare-dark-primary/30">
            <AvatarImage src="" alt={user?.fullname || "User"} />
            <AvatarFallback className="bg-wedshare-light-primary/10 dark:bg-wedshare-dark-primary/10 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary font-semibold">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-wedshare-light-bg dark:bg-wedshare-dark-bg border-wedshare-light-border dark:border-wedshare-dark-border">
        {/* User Info Section */}
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
              {user?.fullname || "User"}
            </p>
            <p className="text-xs leading-none text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-wedshare-light-border dark:bg-wedshare-dark-border" />

        {/* Menu Items */}
        <DropdownMenuItem 
          onClick={() => navigate("/profile")} 
          className="cursor-pointer hover:bg-wedshare-light-bg-secondary dark:hover:bg-wedshare-dark-bg-secondary text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate("/settings")} 
          className="cursor-pointer hover:bg-wedshare-light-bg-secondary dark:hover:bg-wedshare-dark-bg-secondary text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-wedshare-light-border dark:bg-wedshare-dark-border" />

        {/* Theme Toggle */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="theme-toggle" 
              className="flex items-center cursor-pointer text-sm font-normal text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary"
            >
              {theme === "dark" ? (
                <Moon className="mr-2 h-4 w-4" />
              ) : (
                <Sun className="mr-2 h-4 w-4" />
              )}
              <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </Label>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>

        <DropdownMenuSeparator className="bg-wedshare-light-border dark:bg-wedshare-dark-border" />

        {/* Logout */}
        <DropdownMenuItem 
          onClick={() => navigate("/logout")} 
          className="cursor-pointer hover:bg-wedshare-light-error/10 dark:hover:bg-wedshare-dark-error/10 text-wedshare-light-error dark:text-wedshare-dark-error"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}