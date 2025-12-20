export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ADD_WEDDING: "/add-wedding",
  WEDDING_DETAILS: "/wedding-details",
  PHOTO_UPLOAD: "/photo-upload",
}

export type RouteKey = keyof typeof ROUTES

export default ROUTES