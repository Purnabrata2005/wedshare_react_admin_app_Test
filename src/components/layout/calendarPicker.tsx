"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface CalendarPickerProps {
  value: string
  onChange: (date: string) => void
  onClose: () => void
}

export function CalendarPicker({ value, onChange, onClose }: CalendarPickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Helpers: use local date components to avoid UTC offset issues when formatting
  const formatDateLocal = (d: Date) => {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  const parseDateString = (s: string | undefined) => {
    if (!s) return null
    const [year, month, day] = s.split("-")
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  }

  const [currentDate, setCurrentDate] = useState(() => {
    const parsed = parseDateString(value)
    if (parsed) return parsed
    return new Date(today.getFullYear(), today.getMonth(), today.getDate())
  })

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    if (prevMonth >= today) {
      setCurrentDate(prevMonth)
    }
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (selectedDate >= today) {
      const dateString = formatDateLocal(selectedDate)
      onChange(dateString)
      onClose()
    }
  }

  const handleToday = () => {
    const todayString = formatDateLocal(today)
    onChange(todayString)
    onClose()
  }

  const handleClear = () => {
    onChange("")
    onClose()
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Add previous month days
  const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false })
  }

  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true })
  }

  // Add next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false })
  }

  return (
    <div className="bg-wedshare-light-surface dark:bg-wedshare-dark-surface rounded-lg shadow-lg p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-base text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary">
            {months[currentDate.getMonth()]}, {currentDate.getFullYear()}
          </span>
          <ChevronDown className="w-4 h-4 text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-wedshare-light-bg dark:hover:bg-wedshare-dark-bg rounded" aria-label="Previous month">
          <ChevronUp className="w-4 h-4 text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary" />
        </button>
        <button onClick={handleNextMonth} className="p-1 hover:bg-wedshare-light-bg dark:hover:bg-wedshare-dark-bg rounded" aria-label="Next month">
          <ChevronDown className="w-4 h-4 text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {days.map((item, index) => {
          const isToday =
            item.isCurrentMonth &&
            item.day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()

          const parsedValue = value ? parseDateString(value) : null
          const isSelected =
            item.isCurrentMonth &&
            parsedValue &&
            parsedValue.getDate() === item.day &&
            parsedValue.getMonth() === currentDate.getMonth() &&
            parsedValue.getFullYear() === currentDate.getFullYear()

          const isPast =
            item.isCurrentMonth && new Date(currentDate.getFullYear(), currentDate.getMonth(), item.day) < today

          return (
            <button
              key={index}
              onClick={() => item.isCurrentMonth && !isPast && handleDateClick(item.day)}
              disabled={!item.isCurrentMonth || isPast}
              className={`
                w-full aspect-square rounded text-xs font-medium transition-colors
                ${!item.isCurrentMonth || isPast ? "text-wedshare-light-text-secondary dark:text-wedshare-dark-text-secondary cursor-default" : ""}
                ${isToday ? "bg-wedshare-light-primary dark:bg-wedshare-dark-primary text-white" : ""}
                ${isSelected && !isToday ? "bg-wedshare-light-secondary dark:bg-wedshare-dark-secondary text-white" : ""}
                ${item.isCurrentMonth && !isToday && !isSelected && !isPast ? "text-wedshare-light-text-primary dark:text-wedshare-dark-text-primary hover:bg-wedshare-light-bg dark:hover:bg-wedshare-dark-bg" : ""}
              `}
            >
              {item.day}
            </button>
          )
        })}
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between pt-2 border-t border-wedshare-light-bg dark:border-wedshare-dark-bg text-sm">
        <button onClick={handleClear} className="text-wedshare-light-primary dark:text-wedshare-dark-primary hover:opacity-80 font-medium">
          Clear
        </button>
        <button onClick={handleToday} className="text-wedshare-light-primary dark:text-wedshare-dark-primary hover:opacity-80 font-medium">
          Today
        </button>
      </div>
    </div>
  )
}
