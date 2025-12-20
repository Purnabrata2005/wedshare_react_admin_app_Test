import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdvertisementPage from "@/pages/AdvertisementPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ProfilePage from "@/pages/ProfilePage"
import DashboardPage from "@/pages/DashboardPage"
import NotFound from "@/components/ui/not-found-error"
import { ThemeProvider } from "@/components/layout/theme-provider"
import AuthLayout from "@/components/layout/AuthLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import ROUTES from "./routePath"

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
          </Route>

          {/* Profile Route */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Dashboard Route */}
          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
