import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/redux/hooks"
import { loginAction } from "@/redux/slices/authSlice"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    setErrors({})
    setServerError(null)

    //  Form validation
    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    //  Dispatch Redux-Saga login action
    dispatch(
      loginAction({
        username: email, // backend wants "username"
        password: password,
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
          disabled={loading}
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-wedshare-light-error dark:text-wedshare-dark-error">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
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
    </form>
  )
}
