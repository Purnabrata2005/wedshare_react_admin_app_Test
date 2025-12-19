import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10 dark:bg-wedshare-dark-surface dark:border-wedshare-dark-surface dark:text-wedshare-dark-text-primary", className)}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={props.disabled}
        className="absolute top-0 right-0 h-full px-2 sm:px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-500 dark:text-wedshare-dark-text-secondary"
      >
        {showPassword ? (
          <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </button>

      {/* hides browsers password toggles */}
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
