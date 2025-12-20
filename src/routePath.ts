export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ADD_WEDDING: "/add-wedding",
}

export type RouteKey = keyof typeof ROUTES

export default ROUTES