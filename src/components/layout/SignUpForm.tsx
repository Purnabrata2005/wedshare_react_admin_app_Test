import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "./PasswordInput"
import { useAppDispatch } from "@/redux/hooks"
import { registerAction } from "@/redux/slices/authSlice"

export default function SignUpForm() {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError(null)

    const newErrors: Record<string, string> = {}

    if (!name) newErrors.name = "First name is required"
    if (!lastName) newErrors.lastName = "Last name is required"
    if (!email) newErrors.email = "Email is required"
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required"
    if (!password) newErrors.password = "Password is required"
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required"
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    //  Dispatch saga-based registration
    dispatch(
      registerAction({
        fullname: name,
        lastName,
        email,
        phoneNumber,
        password,
        role: "customer",

        onSuccess: () => {
          setLoading(false)
          // TODO: Redirect to dashboard when route is ready
        },

        onError: (msg: string) => {
          setLoading(false)
          setServerError(msg)
        },
      })
    )
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 sm:space-y-5">
      {/* Error Message */}
      {serverError && (
        <div className={`rounded-md p-3 sm:p-4 ${
          serverError.toLowerCase().includes("success")
            ? "bg-green-50 dark:bg-green-950"
            : "bg-red-50 dark:bg-red-950"
        }`}>
          <p className={`text-sm ${
            serverError.toLowerCase().includes("success")
              ? "text-green-800 dark:text-green-200"
              : "text-red-800 dark:text-red-200"
          }`}>
            {serverError}
          </p>
        </div>
      )}

      {/* First Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
          First Name
        </label>
        <Input
          placeholder="Enter your first name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
          disabled={loading}
        />
        {errors.name && <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">{errors.name}</p>}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
          Last Name
        </label>
        <Input
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
          disabled={loading}
        />
        {errors.lastName && <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">{errors.lastName}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
          Email
        </label>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
          disabled={loading}
        />
        {errors.email && <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">{errors.email}</p>}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
          Phone Number
        </label>
        <Input
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="tel"
          className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
          disabled={loading}
        />
        {errors.phoneNumber && (
          <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
          Password
        </label>
        <PasswordInput
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />
        {errors.password && <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
          Confirm Password
        </label>
        <PasswordInput
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface border-gray-200 dark:border-slate-700 text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />
        {errors.confirmPassword && (
          <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-2 sm:py-2.5 text-sm sm:text-base font-semibold"
      >
        {loading ? "Creating..." : "Create account"}
      </Button>
    </form>
  )
}
