interface ErrorAlertProps {
  error: string
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <div className="mb-6 p-4 sm:p-6 bg-wedshare-light-error/10 dark:bg-wedshare-dark-error/20 border border-wedshare-light-error/30 dark:border-wedshare-dark-error/40 rounded-lg">
      <p className="text-sm sm:text-base text-wedshare-light-error dark:text-wedshare-dark-error font-medium">
        {error}
      </p>
    </div>
  )
}