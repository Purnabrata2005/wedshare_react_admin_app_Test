import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  loginAction,
  sendOtpRequest,
  verifyOtpRequest,
} from "@/redux/slices/authSlice"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; otp?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [mode, setMode] = useState<'password' | 'otp'>("password");
  const dispatch = useAppDispatch();
  const { otpSent, otpLoading, otpError, loading } = useAppSelector((s) => s.auth);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    if (mode === "password") {
      // Password login validation
      const newErrors: { email?: string; password?: string } = {};
      if (!email) newErrors.email = "Email is required";
      if (!password) newErrors.password = "Password is required";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      // Dispatch password login
      dispatch(
        loginAction({
          username: email,
          password,
          onSuccess: () => {
            setOtp("");
            setErrors({});
            setServerError(null);
          },
          onError: (msg: string) => setServerError(msg),
        })
      );
    } else {
      // OTP login validation
      const newErrors: { email?: string; otp?: string } = {};
      if (!email) newErrors.email = "Email is required";
      if (!otp) newErrors.otp = "OTP is required";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      dispatch(
        verifyOtpRequest({
          recipient: email,
          recipientType: 2,
          otp,
          onSuccess: () => {
            setOtp("");
            setErrors({});
            setServerError(null);
          },
          onError: (msg: string) => setServerError(msg),
        } as any)
      );
    }
  }

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    setOtp("");
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    dispatch(
      sendOtpRequest({
        recipient: email,
        recipientType: 2,
        onSuccess: () => {},
        onError: (msg: string) => setServerError(msg),
      } as any)
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 sm:space-y-5">
      {/* Error Message */}
      {serverError && (
        <div className="rounded-md bg-red-50 dark:bg-red-950 p-3 sm:p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{serverError}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
          Email
        </label>
        <Input
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
          disabled={loading || otpLoading}
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password or OTP Fields */}
      {mode === "password" ? (
        <>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
              Password
            </label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">
                {errors.password}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-2.5 text-sm sm:text-base font-semibold"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <div className="flex justify-center mt-2">
            <button
              type="button"
              className="text-xs underline text-wedshare-light-primary dark:text-wedshare-dark-primary"
              onClick={() => {
                setMode("otp");
                setOtp("");
                setErrors({});
                setServerError(null);
              }}
              disabled={loading}
            >
              Login with OTP
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={otpLoading || !email}
              className="w-full py-2 sm:py-2.5 text-sm sm:text-base font-semibold"
            >
              {otpLoading ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}
            </Button>
          </div>
          {otpError && (
            <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error mt-1">{otpError}</p>
          )}
          {otpSent && (
            <div className="space-y-2 mt-4">
              <label htmlFor="otp" className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
                Enter OTP
              </label>
              <Input
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
                disabled={otpLoading}
              />
              {errors.otp && (
                <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">
                  {errors.otp}
                </p>
              )}
              <Button
                type="submit"
                disabled={otpLoading}
                className="w-full py-2 sm:py-2.5 text-sm sm:text-base font-semibold"
              >
                {otpLoading ? "Verifying..." : "Verify OTP & Login"}
              </Button>
            </div>
          )}
          <div className="flex justify-center mt-2">
            <button
              type="button"
              className="text-xs underline text-wedshare-light-primary dark:text-wedshare-dark-primary"
              onClick={() => {
                setMode("password");
                setOtp("");
                setErrors({});
                setServerError(null);
              }}
              disabled={otpLoading}
            >
              Login with Password
            </button>
          </div>
        </>
      )}
    </form>
  );
}
