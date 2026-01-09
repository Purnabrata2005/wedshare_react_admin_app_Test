import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import AdvertisementPage from "@/pages/AdvertisementPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ProfilePage from "@/pages/ProfilePage"
import DashboardPage from "@/pages/DashboardPage"
import WeddingDetailsPage from "@/pages/WeddingDetailsPage"
import PhotoUploadPage from "@/pages/PhotoUploadPage"
import InviteGuestsPage from "@/pages/InviteGuestsPage"
import NotFound from "@/components/ui/notFoundError"
import { ThemeProvider } from "@/components/layout/theme-provider"
import AuthLayout from "@/components/layout/AuthLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import { AddWeddingForm } from "@/pages/addWeddingForm"
import ROUTES from "./routePath"

import AuthCallbackPage from "@/pages/AuthCallbackPage"


// Wrapper component to handle navigation for AddWeddingForm
function AddWeddingPage() {
  const navigate = useNavigate()
  
  const handleSave = () => {
    navigate(ROUTES.DASHBOARD)
  }
  
  const handleBack = () => {
    navigate(-1)
  }
  
  return <AddWeddingForm onSave={handleSave} onBack={handleBack} />
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* Home Route */}
          <Route path={ROUTES.HOME} element={<AdvertisementPage />} />

          {/* Auth Routes with Layout */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<RegisterPage />} />
            {/* Google OAuth Callback Route */}
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          </Route>

          {/* Profile Route */}
          <Route path={ROUTES.PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Dashboard Route */}
          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* Add Wedding Form Route */}
          <Route path={ROUTES.ADD_WEDDING} element={<ProtectedRoute><AddWeddingPage /></ProtectedRoute>} />

          {/* Wedding Details Route */}
          <Route path={ROUTES.WEDDING_DETAILS} element={<ProtectedRoute><WeddingDetailsPage /></ProtectedRoute>} />

          {/* Photo Upload Route */}
          <Route path={ROUTES.PHOTO_UPLOAD} element={<ProtectedRoute><PhotoUploadPage /></ProtectedRoute>} />

          {/* Invite Guests Route */}
          <Route path={ROUTES.INVITE_GUESTS} element={<ProtectedRoute><InviteGuestsPage /></ProtectedRoute>} />

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
