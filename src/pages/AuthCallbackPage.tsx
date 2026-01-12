import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/redux/hooks";
import { verifySessionAction } from "@/redux/slices/authSlice";
import ROUTES from "@/routePath";

export default function AuthCallbackPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Google OAuth has already set the HttpOnly cookie.
    // We just need to verify the session.
    dispatch(verifySessionAction());

    // Redirect immediately; route guards will handle auth state
    navigate(ROUTES.DASHBOARD, { replace: true });
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Signing you in…
      </p>
    </div>
  );
}
