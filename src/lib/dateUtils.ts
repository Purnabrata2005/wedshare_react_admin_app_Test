/**
 * Formats a date string to dd-mm-yyyy format.
 * @param dateString - The date string to format (ISO format or parseable date)
 * @returns Formatted date string in dd-mm-yyyy format or empty string
 */
export function formatDateDDMMYYYY(dateString?: string | null): string {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) return ""
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}-${month}-${year}`
}

/**
 * Formats a date string safely, returning a fallback for invalid/missing dates.
 * @param dateString - The date string to format (ISO format or parseable date)
 * @param fallback - Fallback text for invalid/missing dates (default: "TBD")
 * @param options - Intl.DateTimeFormatOptions for customizing output format
 * @returns Formatted date string or fallback
 */
export function formatDateSafe(
  dateString?: string | null,
  fallback: string = "TBD",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  if (!dateString) return fallback
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) return "Invalid date"
  
  return date.toLocaleDateString("en-US", options)
}

/**
 * Formats a date for display with time.
 */
export function formatDateTimeSafe(
  dateString?: string | null,
  fallback: string = "TBD"
): string {
  return formatDateSafe(dateString, fallback, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/**
 * Gets a relative time string (e.g., "in 3 days", "2 months ago").
 */
export function getRelativeTime(dateString?: string | null): string {
  if (!dateString) return "TBD"
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Invalid date"
  
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === -1) return "Yesterday"
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`
  
  return formatDateSafe(dateString)
}
