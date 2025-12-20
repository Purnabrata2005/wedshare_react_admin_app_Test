/**
 * Form Utilities and Helpers
 * Provides utility functions for form operations and validations
 */

/**
 * Convert ISO date string to yyyy-mm-dd format
 * Handles various date string formats
 */
export const convertDateToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return ""

  // Already in yyyy-mm-dd format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }

  // ISO format with time: 2025-12-18T00:00:00.000Z
  if (dateString.includes("T")) {
    return dateString.split("T")[0]
  }

  // Try to parse and convert
  try {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, "0")
      const day = String(date.getUTCDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }
  } catch {
    // Continue to fallback
  }

  return dateString
}

/**
 * Format date string from yyyy-mm-dd to dd-mm-yyyy
 * Useful for display purposes
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return ""
  const [year, month, day] = dateString.split("-")
  return `${day}-${month}-${year}`
}

/**
 * Format date string from dd-mm-yyyy to yyyy-mm-dd
 * Useful for input purposes
 */
export const formatDateForInput = (displayDate: string): string => {
  if (!displayDate) return ""
  const [day, month, year] = displayDate.split("-")
  return `${year}-${month}-${day}`
}

/**
 * Validate if date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  if (!dateString) return false
  const date = new Date(dateString)
  return date > new Date()
}

/**
 * Validate if date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  if (!dateString) return false
  const date = new Date(dateString)
  return date < new Date()
}

/**
 * Get days until wedding
 */
export const getDaysUntilWedding = (weddingDate: string): number => {
  if (!weddingDate) return 0
  const wedding = new Date(weddingDate)
  const today = new Date()
  const diff = wedding.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Generate invitation text from template
 */
export interface InvitationVariables {
  bride?: string
  groom?: string
  date?: string
  venue?: string
  [key: string]: string | undefined
}

export const generateInvitationText = (
  templateText: string,
  variables: InvitationVariables
): string => {
  let text = templateText

  Object.entries(variables).forEach(([key, value]) => {
    const pattern = new RegExp(`\\[${key.charAt(0).toUpperCase() + key.slice(1)}\\]`, "g")
    text = text.replace(pattern, value || "")
  })

  return text
}

/**
 * Validate wedding form data
 */
export interface WeddingFormValidation {
  isValid: boolean
  errors: Record<string, string>
}

export const validateWeddingForm = (formData: any): WeddingFormValidation => {
  const errors: Record<string, string> = {}

  // Groom name validation
  if (!formData.groom?.trim()) {
    errors.groom = "Groom name is required"
  } else if (formData.groom.trim().length < 2) {
    errors.groom = "Groom name must be at least 2 characters"
  }

  // Bride name validation
  if (!formData.bride?.trim()) {
    errors.bride = "Bride name is required"
  } else if (formData.bride.trim().length < 2) {
    errors.bride = "Bride name must be at least 2 characters"
  }

  // Wedding date validation
  if (!formData.date) {
    errors.date = "Wedding date is required"
  } else if (!isFutureDate(formData.date)) {
    errors.date = "Wedding date must be in the future"
  }

  // Venue validation
  if (!formData.venue?.trim()) {
    errors.venue = "Wedding venue is required"
  } else if (formData.venue.trim().length < 3) {
    errors.venue = "Venue name must be at least 3 characters"
  }

  // Reception date validation (if different from wedding)
  if (!formData.receptionSame) {
    if (!formData.receptionDate) {
      errors.receptionDate = "Reception date is required"
    } else if (!isFutureDate(formData.receptionDate)) {
      errors.receptionDate = "Reception date must be in the future"
    }

    if (!formData.receptionVenue?.trim()) {
      errors.receptionVenue = "Reception venue is required"
    }
  }

  // Invitation template validation
  if (!formData.invitationTemplate) {
    errors.invitationTemplate = "Please select an invitation template"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Parse wedding payload for display
 */
export const parseWeddingForDisplay = (wedding: any) => {
  return {
    ...wedding,
    weddingDate: formatDateForDisplay(wedding.weddingDate || ""),
    receptionDate: formatDateForDisplay(wedding.receptionDate || ""),
    daysUntilWedding: getDaysUntilWedding(wedding.weddingDate || ""),
    isSameVenue:
      wedding.receptionVenue === wedding.venue &&
      wedding.receptionDate === wedding.weddingDate,
  }
}

/**
 * Prepare form data for submission
 */
export const prepareWeddingPayload = (formData: any, userId: string, isEdit = false) => {
  const basePayload = {
    groomName: formData.groom?.trim(),
    brideName: formData.bride?.trim(),
    weddingDate: formData.date,
    venue: formData.venue?.trim(),
    receptionDate: formData.receptionSame ? formData.date : formData.receptionDate,
    receptionVenue: formData.receptionSame ? formData.venue : formData.receptionVenue?.trim(),
    invitationTemplate: formData.invitationTemplate,
  }

  if (!isEdit) {
    return {
      ...basePayload,
      weddingId: `wedding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    }
  }

  return basePayload
}

/**
 * Calculate wedding timeline
 */
export interface WeddingTimeline {
  label: string
  daysFromNow: number
  daysBeforeWedding: number
  date: string
}

export const calculateWeddingTimeline = (weddingDate: string): WeddingTimeline[] => {
  const milestones = [
    { label: "Engagement Announcement", months: 12 },
    { label: "Save the Dates", months: 9 },
    { label: "Send Invitations", months: 6 },
    { label: "Final Guest Count", months: 2 },
    { label: "Final Venue Walk-through", months: 1 },
    { label: "Wedding Day", months: 0 },
  ]

  const wedding = new Date(weddingDate)

  return milestones.map((milestone) => {
    const date = new Date(wedding)
    date.setMonth(date.getMonth() - milestone.months)

    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return {
      label: milestone.label,
      daysFromNow: diffDays,
      daysBeforeWedding: milestone.months * 30,
      date: date.toISOString().split("T")[0],
    }
  })
}

/**
 * Get wedding status
 */
export type WeddingStatus = "upcoming" | "today" | "past" | "invalid"

export const getWeddingStatus = (weddingDate: string): WeddingStatus => {
  if (!weddingDate) return "invalid"

  const wedding = new Date(weddingDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weddingDay = new Date(wedding)
  weddingDay.setHours(0, 0, 0, 0)

  if (weddingDay.getTime() === today.getTime()) {
    return "today"
  } else if (weddingDay > today) {
    return "upcoming"
  } else {
    return "past"
  }
}

/**
 * Get wedding status badge style
 */
export const getStatusBadgeStyle = (
  status: WeddingStatus
): { bg: string; text: string; label: string } => {
  const styles = {
    upcoming: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      label: "Upcoming",
    },
    today: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-300",
      label: "Today!",
    },
    past: {
      bg: "bg-gray-100 dark:bg-gray-900/30",
      text: "text-gray-700 dark:text-gray-300",
      label: "Completed",
    },
    invalid: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      label: "Invalid",
    },
  }

  return styles[status]
}

/**
 * Format wedding card display info
 */
export interface WeddingCardInfo {
  title: string
  subtitle: string
  date: string
  daysRemaining: number
  status: WeddingStatus
  statusStyle: ReturnType<typeof getStatusBadgeStyle>
}

export const formatWeddingCardInfo = (wedding: any): WeddingCardInfo => {
  const status = getWeddingStatus(wedding.weddingDate || "")
  const daysRemaining = getDaysUntilWedding(wedding.weddingDate || "")

  return {
    title: `${wedding.brideName} & ${wedding.groomName}`,
    subtitle: wedding.venue || "Venue TBA",
    date: formatDateForDisplay(wedding.weddingDate || ""),
    daysRemaining,
    status,
    statusStyle: getStatusBadgeStyle(status),
  }
}
