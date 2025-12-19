import GoogleSignInButton from "@/components/GoogleSignInButton";
import  SignUpForm  from "@/components/layout/SignUpForm";
import { Link } from "react-router-dom";
import ROUTES from "@/routePath";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wedshare-light-bg dark:bg-wedshare-dark-bg px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
            Sign up to wedShare
          </h1>
          <p className="mt-2 text-sm sm:text-base text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
            Create an account to get started
          </p>
        </div>

        {/* Google Sign In Button */}
        <div>
          <GoogleSignInButton />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          <span className="text-xs sm:text-base text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary font-medium">
            OR
          </span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
        </div>

        {/* Sign Up Form */}
        <div>
          <SignUpForm />
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm sm:text-base text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-semibold text-wedshare-light-primary dark:text-wedshare-dark-primary hover:text-wedshare-light-secondary dark:hover:text-wedshare-dark-secondary transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
