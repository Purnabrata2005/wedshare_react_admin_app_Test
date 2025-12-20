import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { logoutAction } from "@/redux/slices/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/ui/navbar"
import { AlertCircle, CheckCircle, Mail, Phone, MapPin, Edit2, LogOut, User, Calendar, Sparkles } from "lucide-react"

interface ValidationErrors {
  [key: string]: string
}

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/
  return phone === "" || phoneRegex.test(phone)
}

const validateProfile = (profile: any): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!profile.fullname?.trim()) {
    errors.fullname = "First name is required"
  } else if (profile.fullname?.trim().length < 2) {
    errors.fullname = "First name must be at least 2 characters"
  }

  if (!profile.lastName?.trim()) {
    errors.lastName = "Last name is required"
  } else if (profile.lastName?.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters"
  }

  if (!profile.email?.trim()) {
    errors.email = "Email is required"
  } else if (!validateEmail(profile.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (profile.phoneNumber && !validatePhone(profile.phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number"
  }

  if (profile.bio && profile.bio.length > 500) {
    errors.bio = "Bio must be less than 500 characters"
  }

  return errors
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((state) => state.auth.user)
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [toasts, setToasts] = useState<Toast[]>([])

  const [profile, setProfile] = useState({
    id: authUser?.id || "user123",
    fullname: authUser?.fullname || "John",
    lastName: authUser?.lastName || "Doe",
    email: authUser?.email || "user@example.com",
    phoneNumber: authUser?.phoneNumber || "+1 (555) 000-0000",
    role: authUser?.role || "User",
    location: "New York, USA",
    bio: "Welcome to my profile! 💕✨",
    joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile(profile)
    setValidationErrors({})
  }

  const handleSave = async () => {
    const errors = validateProfile(editedProfile)
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      addToast("Please fix the errors before saving", "error")
      return
    }

    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfile(editedProfile)
      setIsEditing(false)
      setValidationErrors({})
      addToast("Profile updated successfully!", "success")
    } catch (_error) {
      addToast("Failed to save profile. Please try again.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
    setValidationErrors({})
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      dispatch(logoutAction())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      addToast("Logged out successfully", "success")
      
      setTimeout(() => {
        navigate("/login")
      }, 500)
    } catch (_error) {
      addToast("Failed to logout. Please try again.", "error")
      setIsLoggingOut(false)
    }
  }

  const initials = `${profile.fullname.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <div className="sticky top-0 z-40 shadow-lg">
        <Navbar
          title="Account Settings"
          subtitle="Manage your profile "
          showBackButton={true}
          onBackClick={() => navigate(-1)}
        />
      </div>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto max-w-sm border ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500"
                : toast.type === "error"
                ? "bg-destructive/10 border-destructive"
                : "bg-primary/10 border-primary"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-primary shrink-0" />
            )}
            <p
              className={`text-sm sm:text-base font-medium ${
                toast.type === "success"
                  ? "text-green-500"
                  : toast.type === "error"
                  ? "text-destructive"
                  : "text-primary"
              }`}
            >
              {toast.message}
            </p>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Profile Hero Card */}
        <Card className="overflow-hidden bg-card border-0 shadow-xl">
          {/* Header Background */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-primary via-secondary to-primary" />

          {/* Profile Info */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-20 sm:-mt-16">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                {/* Avatar */}
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-card shadow-lg">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=john" alt={`${profile.fullname} ${profile.lastName}`} />
                  <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Profile Basic Info */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                      {isEditing ? editedProfile.fullname : profile.fullname}{" "}
                      {isEditing ? editedProfile.lastName : profile.lastName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {profile.role}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {profile.joinDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {!isEditing ? (
                  <Button
                    onClick={handleEdit}
                    className="bg-primary hover:bg-secondary text-primary-foreground shadow-lg w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-primary hover:bg-secondary text-primary-foreground shadow-lg w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Validation Errors Banner */}
        {Object.keys(validationErrors).length > 0 && isEditing && (
          <Card className="p-4 sm:p-6 bg-destructive/5 border-l-4 border-destructive shadow-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive mb-3">
                  Fix these errors to continue
                </h3>
                <ul className="space-y-2">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li
                      key={field}
                      className="text-sm text-destructive flex items-center gap-2"
                    >
                      <span className="inline-block w-2 h-2 bg-destructive rounded-full" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Personal Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Personal Information
            </h2>
          </div>
          <Card className="p-6 sm:p-8 bg-card border border-primary/20 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  First Name
                </label>
                {isEditing ? (
                  <Input
                    value={editedProfile.fullname}
                    onChange={(e) => handleInputChange("fullname", e.target.value)}
                    className={`bg-card border-primary/30 focus:ring-primary transition-all ${
                      validationErrors.fullname ? "border-destructive" : ""
                    }`}
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="text-muted-foreground font-medium py-2">
                    {profile.fullname}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Last Name
                </label>
                {isEditing ? (
                  <Input
                    value={editedProfile.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`bg-card border-primary/30 focus:ring-primary transition-all ${
                      validationErrors.lastName ? "border-destructive" : ""
                    }`}
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="text-muted-foreground font-medium py-2">
                    {profile.lastName}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Role
                </label>
                <div className="py-2">
                  <Badge className="bg-primary/10 text-primary border-primary/30">
                    {profile.role}
                  </Badge>
                </div>
              </div>

              {/* Join Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <p className="text-muted-foreground font-medium py-2">
                  {profile.joinDate}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Contact Information
            </h2>
          </div>
          <Card className="p-6 sm:p-8 bg-card border border-primary/20 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`bg-card border-primary/30 focus:ring-primary transition-all ${
                      validationErrors.email ? "border-destructive" : ""
                    }`}
                    placeholder="Enter email"
                  />
                ) : (
                  <p className="text-muted-foreground break-all font-medium py-2">
                    {profile.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedProfile.phoneNumber || ""}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className={`bg-card border-primary/30 focus:ring-primary transition-all ${
                      validationErrors.phoneNumber ? "border-destructive" : ""
                    }`}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-muted-foreground font-medium py-2">
                    {profile.phoneNumber || "Not provided"}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  Location
                </label>
                {isEditing ? (
                  <Input
                    value={editedProfile.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="bg-card border-primary/30 focus:ring-primary transition-all"
                    placeholder="Enter your location"
                  />
                ) : (
                  <p className="text-muted-foreground font-medium py-2">
                    {profile.location || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* About Me Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              About Me
            </h2>
          </div>
          <Card className="p-6 sm:p-8 bg-card border border-primary/20 shadow-lg">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedProfile.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-32 sm:min-h-40 resize-none border-primary/30 transition-all ${
                    validationErrors.bio ? "border-destructive" : ""
                  }`}
                  placeholder="Tell us about yourself..."
                />
                {editedProfile.bio && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {editedProfile.bio.length}/500 characters
                    </p>
                    {editedProfile.bio.length > 400 && (
                      <p className="text-xs text-yellow-500">
                        {500 - editedProfile.bio.length} remaining
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {profile.bio || "No bio added yet. Click Edit Profile to add one!"}
              </p>
            )}
          </Card>
        </div>

        {/* Account Actions Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LogOut className="w-5 h-5 text-destructive" />
            <h2 className="text-2xl font-bold text-foreground">
              Account
            </h2>
          </div>
          <Card className="p-6 sm:p-8 bg-destructive/5 border border-destructive/20 shadow-lg">
            <p className="text-sm text-muted-foreground mb-4">
              Manage your account security and sign out from this device.
            </p>
            <Button
              onClick={() => setShowLogoutConfirm(true)}
              disabled={isLoggingOut}
              className="bg-destructive hover:bg-red-700 text-white shadow-lg w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Card>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-sm">
          <Card className="max-w-sm w-full bg-card animate-in zoom-in-95 duration-300 shadow-2xl border-0">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-destructive/10 rounded-lg shrink-0">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Sign out?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Are you sure you want to sign out? You'll need to log in again to access your account.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={isLoggingOut}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full bg-destructive hover:bg-red-700 text-white transition-all duration-200"
                >
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
