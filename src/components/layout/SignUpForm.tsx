import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "./PasswordInput";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerAction } from "@/redux/slices/authSlice";
import ROUTES from "@/routePath";

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  /* -------------------------
     FORM STATE
  -------------------------- */
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* -------------------------
     REDIRECT AFTER LOGIN
  -------------------------- */
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /* -------------------------
     SUBMIT
  -------------------------- */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors: Record<string, string> = {};

    if (!name.trim()) validationErrors.name = "First name is required";
    if (!lastName.trim()) validationErrors.lastName = "Last name is required";
    if (!email.trim()) validationErrors.email = "Email is required";
    if (!phoneNumber.trim())
      validationErrors.phoneNumber = "Phone number is required";
    if (!password) validationErrors.password = "Password is required";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(
      registerAction({
        fullname: name,
        lastName,
        email,
        phoneNumber,
        password,
        role: "customer",
      })
    );
  };

  /* -------------------------
     RENDER
  -------------------------- */
  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 sm:space-y-5">
      {/* Server Error */}
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-950 p-3 sm:p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            {error}
          </p>
        </div>
      )}

      {/* First Name */}
      <Field
        label="First Name"
        value={name}
        onChange={setName}
        placeholder="Enter your first name"
        error={errors.name}
        disabled={loading}
      />

      {/* Last Name */}
      <Field
        label="Last Name"
        value={lastName}
        onChange={setLastName}
        placeholder="Enter your last name"
        error={errors.lastName}
        disabled={loading}
      />

      {/* Email */}
      <Field
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
        error={errors.email}
        disabled={loading}
        type="email"
      />

      {/* Phone Number */}
      <Field
        label="Phone Number"
        value={phoneNumber}
        onChange={setPhoneNumber}
        placeholder="Enter your phone number"
        error={errors.phoneNumber}
        disabled={loading}
        type="tel"
      />

      {/* Password */}
      <PasswordField
        label="Password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        disabled={loading}
      />

      {/* Confirm Password */}
      <PasswordField
        label="Confirm Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        disabled={loading}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-2 sm:py-2.5 text-sm sm:text-base font-semibold"
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

/* =========================================================
   REUSABLE FIELD COMPONENTS
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
        {label}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface
                   border-gray-200 dark:border-slate-700
                   text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary
                   placeholder:text-gray-400 dark:placeholder:text-slate-500"
      />
      {error && (
        <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
        {label}
      </label>
      <PasswordInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface
                   border-gray-200 dark:border-slate-700
                   text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary"
      />
      {error && (
        <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">
          {error}
        </p>
      )}
    </div>
  );
}
