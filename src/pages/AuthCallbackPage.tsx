import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import ROUTES from "../routePath";
import { oauthLoginSuccess } from "@/redux/slices/authSlice";

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const run = async () => {
      try {
        const accessToken = getCookie("accessToken");
        if (!accessToken) throw new Error("No access token in cookies");

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/login/verify`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );

        dispatch(
          oauthLoginSuccess({
            token: accessToken,
            user: data?.data, // API returns user info in data.data
          })
        );
        navigate(ROUTES.DASHBOARD, { replace: true });
      } catch {
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    run();
  }, [dispatch, navigate]);

  return null; // nothing rendered
}
