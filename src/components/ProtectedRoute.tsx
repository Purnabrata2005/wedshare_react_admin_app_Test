import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/redux/hooks"
import ROUTES from "@/routePath"

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token } = useAppSelector((state) => state.auth)

  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}
