import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdvertisementPage from "@/pages/AdvertisementPage"
import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
  return (
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdvertisementPage />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}
