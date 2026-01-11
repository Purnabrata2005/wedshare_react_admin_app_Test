import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import ROUTES from "../routePath";
import { oauthLoginSuccess } from "@/redux/slices/authSlice";

// Simple cookie reader
const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

// Handles /auth/callback after Google OAuth
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code) {
        navigate(ROUTES.LOGIN);
        return;
      }

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/login/google-callback`,
          { code, state },
          { withCredentials: true }
        );

        const accessToken = getCookie("accessToken");
        if (!accessToken) throw new Error("No access token in cookies");

        // Verify the token with the backend
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/login/verify`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        dispatch(oauthLoginSuccess({
          token: `${accessToken}`,
          user: response.data.user
        }));
        navigate(ROUTES.DASHBOARD);
      } catch {
        navigate(ROUTES.LOGIN);
      }
    };

    run();
  }, [dispatch, navigate]);

  return <div>Signing you in...</div>;
}
