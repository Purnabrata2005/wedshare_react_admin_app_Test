export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ADD_WEDDING: "/add-wedding",
  WEDDING_DETAILS: "/wedding-details",
  PHOTO_UPLOAD: "/photo-upload",
  INVITE_GUESTS: "/invite-guests",
}

export type RouteKey = keyof typeof ROUTES

export default ROUTES