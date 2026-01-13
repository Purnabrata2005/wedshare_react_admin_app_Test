import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import GoogleSignInButton from "@/components/layout/GoogleSignInButton";
import LoginForm from "@/components/layout/LoginForm";
import ROUTES from "@/routePath";

export default function LoginPage() {
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector(
    (state: any) => state.auth
  );

  /* -------------------------------------------------
     Redirect if already logged in
  ------------------------------------------------- */
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  /* -------------------------------------------------
     Prevent flicker while checking session
  ------------------------------------------------- */
  if (loading) {
    return null;
  }

  /* -------------------------------------------------
     LOGIN PAGE
  ------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-wedshare-light-bg dark:bg-wedshare-dark-bg px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
            Login to wedShare
          </h1>
          <p className="mt-2 text-sm sm:text-base text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
            Welcome back! Please log in to your account
          </p>
        </div>

        {/* Google Sign In */}
        <GoogleSignInButton />

        {/* Divider */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          <span className="text-xs sm:text-sm text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary font-medium">
            OR
          </span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
        </div>

        {/* Login Form */}
        <LoginForm />

      </div>
    </div>
  );
}
