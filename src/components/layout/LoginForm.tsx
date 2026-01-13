import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useNavigate } from "react-router-dom"
import ROUTES from "@/routePath"
import {
  sendOtpRequest,
  verifyOtpRequest,
} from "@/redux/slices/authSlice"
import { sendOtpSchema, verifyOtpSchema } from "@/redux/schemas/authSchemas"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ email?: string; otp?: string }>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { otpSent, otpLoading } = useAppSelector((s) => s.auth);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Client-side validation with Zod
    const validation = verifyOtpSchema.safeParse({
      recipient: email,
      recipientType: 1, // 1 for email
      otp,
    });

    if (!validation.success) {
      const newErrors: { email?: string; otp?: string } = {};
      validation.error.issues.forEach((err: any) => {
        if (err.path.includes("recipient")) newErrors.email = err.message;
        if (err.path.includes("otp")) newErrors.otp = err.message;
      });
      setErrors(newErrors);
      return;
    }

    dispatch(
      verifyOtpRequest({
        recipient: email,
        recipientType: 1, // 1 for email
        otp,
        onSuccess: () => {
          setOtp("");
          setErrors({});
          navigate(ROUTES.DASHBOARD);
        },
        onError: () => {
          // Error is handled by saga with toast
        },
      } as any)
    );
  }

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setOtp("");

    // Client-side validation with Zod
    const validation = sendOtpSchema.safeParse({
      recipient: email,
      recipientType: 1, // 1 for email
    });

    if (!validation.success) {
      const newErrors: { email?: string } = {};
      validation.error.issues.forEach((err: any) => {
        if (err.path.includes("recipient")) newErrors.email = err.message;
      });
      setErrors(newErrors);
      return;
    }

    dispatch(
      sendOtpRequest({
        recipient: email,
        recipientType: 1, // 1 for email
        onSuccess: () => {},
        onError: () => {
          // Error is handled by saga with toast
        },
      } as any)
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 sm:space-y-5">
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
          disabled={otpLoading}
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">
            {errors.email}
          </p>
        )}
      </div>

      {/* Send OTP Button */}
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

      {/* OTP Input - Shows after OTP is sent */}
      {otpSent && (
        <div className="space-y-2 mt-4">
          <label htmlFor="otp" className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
            Enter OTP
          </label>
          <Input
            id="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            maxLength={6}
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
    </form>
  );
}
