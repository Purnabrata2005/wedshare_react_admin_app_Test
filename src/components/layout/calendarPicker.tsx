"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

  // Update currentDate when value prop changes
  useEffect(() => {
    const parsed = parseDateString(value)
    if (parsed) {
      setCurrentDate(parsed)
    }
  }, [value])

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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
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
    <div className="bg-card border border-border rounded-lg shadow-lg p-4 w-72">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((item, index) => {
          const parsedValue = value ? parseDateString(value) : null
          const isSelected =
            item.isCurrentMonth &&
            parsedValue &&
            parsedValue.getDate() === item.day &&
            parsedValue.getMonth() === currentDate.getMonth() &&
            parsedValue.getFullYear() === currentDate.getFullYear()

          const isToday =
            !parsedValue && // Only show today highlight if no date is selected
            item.isCurrentMonth &&
            item.day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()

          const isPast =
            item.isCurrentMonth && new Date(currentDate.getFullYear(), currentDate.getMonth(), item.day) < today

          return (
            <button
              key={index}
              onClick={() => item.isCurrentMonth && !isPast && handleDateClick(item.day)}
              disabled={!item.isCurrentMonth || isPast}
              className={cn(
                "h-8 text-xs font-medium rounded transition-colors",
                !item.isCurrentMonth && "text-muted-foreground",
                item.isCurrentMonth && !isPast && !isToday && !isSelected && "text-foreground cursor-pointer hover:bg-accent",
                isPast && !item.isCurrentMonth && "text-muted-foreground cursor-default",
                isPast && item.isCurrentMonth && "text-muted-foreground cursor-default",
                isToday && "bg-primary text-primary-foreground font-bold hover:bg-primary/90",
                isSelected && "bg-secondary text-secondary-foreground font-bold hover:bg-secondary/90"
              )}
            >
              {item.day}
            </button>
          )
        })}
      </div>

      {/* Footer buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex-1"
        >
          Clear
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="flex-1"
        >
          Today
        </Button>
      </div>
    </div>
  )
}
