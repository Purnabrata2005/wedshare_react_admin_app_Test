import { useNavigate } from "react-router-dom"
import { LogOut, Settings, User, Moon, Sun } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/layout/theme-provider"
import { useAppSelector } from "@/redux/hooks"
import "./AvatarDropdown.css"

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
    <div className="side-menu-container">
      <div className="side-menu-header">
        <Avatar className="side-menu-avatar">
          <AvatarImage src="" alt={user?.fullname || "User"} />
          <AvatarFallback className="bg-wedshare-light-primary/10 dark:bg-wedshare-dark-primary/10 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary font-semibold">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
        <div className="user-details">
          <p className="user-name">
            {user?.fullname || "User"}
          </p>
          <p className="user-email">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>

      <div className="menu-divider"></div>

      <div className="menu-items">
        <button 
          onClick={() => navigate("/profile")} 
          className="menu-item"
        >
          <User className="menu-icon" />
          <span>Profile</span>
        </button>

        <button 
          onClick={() => navigate("/settings")} 
          className="menu-item"
        >
          <Settings className="menu-icon" />
          <span>Settings</span>
        </button>

        <div className="theme-toggle-item">
          <div className="theme-toggle-content">
            <div className="theme-label">
              {theme === "dark" ? (
                <Moon className="menu-icon" />
              ) : (
                <Sun className="menu-icon" />
              )}
              <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>

        <div className="menu-divider"></div>

        <button 
          onClick={() => navigate("/logout")} 
          className="menu-item logout-item"
        >
          <LogOut className="menu-icon" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}