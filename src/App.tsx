import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdvertisementPage from "@/pages/AdvertisementPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import { ThemeProvider } from "@/components/layout/theme-provider"
import AuthLayout from "@/components/layout/AuthLayout"
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
