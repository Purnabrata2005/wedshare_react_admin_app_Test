import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import ROUTES from "../routePath";
import { oauthLoginSuccess } from "@/redux/slices/authSlice";

// Handles /auth/callback after Google OAuth
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Parse query params (code, state, etc.)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      // Exchange code for JWT/session with backend
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/login/google-callback`, { code, state }, { withCredentials: true })
        .then((res) => {
          // Save auth state (e.g., user, token)
          dispatch(oauthLoginSuccess(res.data));
          navigate(ROUTES.DASHBOARD);
        })
        .catch(() => {
          // On error, redirect to login
          navigate(ROUTES.LOGIN);
        });
    } else {
      // No code, redirect to login
      navigate(ROUTES.LOGIN);
    }
  }, [dispatch, navigate]);

  return <div>Signing you in...</div>;
}
