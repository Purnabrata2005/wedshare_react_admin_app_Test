import { useState, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Mail, Trash2, Users, Send, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/ui/navbar"
import { cn } from "@/lib/utils"
import { formatDateDDMMYYYY } from "@/lib/dateUtils"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  addGuests,
  removeGuest,
  sendInvitationAction,
  EmailType,
  type EmailTypeValue,
  type GuestItem,
  type EmailObject,
  type InviteWeddingData,
} from "@/redux/slices/inviteSlice"

interface LocationState {
  weddingId?: string
}

export default function InviteGuestsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  // Get state from Redux
  const { guests, loading: isSending } = useAppSelector((state) => state.invite)
  const { weddings, selectedWedding } = useAppSelector((state) => state.weddings)

  // Get weddingId from location state
  const state = location.state as LocationState | null
  const weddingId = state?.weddingId || ""

  // Find the wedding from store (either selectedWedding or from weddings list)
  const wedding = useMemo(() => {
    if (selectedWedding && (selectedWedding.weddingId === weddingId || selectedWedding.id === weddingId)) {
      return selectedWedding
    }
    return weddings.find((w) => w.weddingId === weddingId || w.id === weddingId) || null
  }, [selectedWedding, weddings, weddingId])

  // Wedding data for invitation from Redux store
  const weddingData: InviteWeddingData = useMemo(() => ({
    bride_name: wedding?.brideName || "",
    groom_name: wedding?.groomName || "",
    wedding_date: formatDateDDMMYYYY(wedding?.weddingDate),
    wedding_time: wedding?.weddingTime || "",
    wedding_venue: wedding?.weddingVenue || "",
    reception_date: formatDateDDMMYYYY(wedding?.receptionDate),
    reception_time: wedding?.receptionTime || "",
    reception_venue: wedding?.receptionVenue || "",
  }), [wedding])

  // Redirect if no weddingId provided
  if (!weddingId) {
    navigate("/dashboard", { replace: true })
  }

  const [guestEmails, setGuestEmails] = useState("")
  const [eventType, setEventType] = useState<"marriage" | "reception" | "both">("both")

  const handleAddGuests = () => {
    const emails = guestEmails
      .split(/[\n,]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))

    if (emails.length === 0) {
      alert("Please enter valid email addresses")
      return
    }

    const newGuests: GuestItem[] = emails.map((email) => ({
      id: Date.now() + Math.random(),
      email,
      eventType,
    }))

    dispatch(addGuests(newGuests))
    setGuestEmails("")
  }

  const handleRemoveGuest = (id: number) => {
    dispatch(removeGuest(id))
  }

  // Helper function to convert eventType to EmailType
  const getEmailType = (type: "marriage" | "reception" | "both"): EmailTypeValue => {
    switch (type) {
      case "marriage":
        return EmailType.MARRIAGE
      case "reception":
        return EmailType.RECEPTION
      case "both":
        return EmailType.BOTH
      default:
        return EmailType.BOTH
    }
  }

  const handleSendInvitations = () => {
    if (guests.length === 0) return

    // Group guests by event type
    const groupedEmails: { [key: number]: EmailObject } = {}

    guests.forEach((guest) => {
      const emailType = getEmailType(guest.eventType)

      if (!groupedEmails[emailType]) {
        groupedEmails[emailType] = {
          emailType,
          body: [],
        }
      }

      groupedEmails[emailType].body.push({ to: guest.email })
    })

    const emails: EmailObject[] = Object.values(groupedEmails)

    // Console log the send data
    console.log("Sending invitation data:", {
      emails,
      data: weddingData,
    })

    // Dispatch send invitation action
    dispatch(
      sendInvitationAction({
        emails,
        data: weddingData,
        onSuccess: () => {
          alert("Invitations sent successfully!")
        },
        onError: (msg) => {
          alert(`Failed to send invitations: ${msg}`)
        },
      })
    )
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getEventBadge = (type: string) => {
    switch (type) {
      case "marriage":
        return <Badge variant="secondary">Marriage</Badge>
      case "reception":
        return <Badge variant="outline">Reception</Badge>
      case "both":
        return <Badge variant="default">Both Events</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        title="Invite Guests"
        subtitle="Send invitations to your wedding guests"
        showBackButton
        onBackClick={handleBack}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Add Guests Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Mail className="w-5 h-5 text-primary" />
                Enter Guest Emails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <textarea
                  placeholder="Enter email addresses separated by comma or new line&#10;(e.g., john@example.com, jane@example.com)"
                  value={guestEmails}
                  onChange={(e) => setGuestEmails(e.target.value)}
                  className="w-full min-h-28 px-4 py-3 rounded-xl border-2 border-input bg-background resize-none transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>

              {/* Event Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Event Type
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "marriage", label: "Marriage Only" },
                    { value: "reception", label: "Reception Only" },
                    { value: "both", label: "Both Events" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 border-2",
                        eventType === option.value
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/50 border-transparent hover:bg-muted"
                      )}
                    >
                      <input
                        type="radio"
                        name="eventType"
                        value={option.value}
                        checked={eventType === option.value}
                        onChange={(e) => setEventType(e.target.value as typeof eventType)}
                        className="w-4 h-4 cursor-pointer accent-primary"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <Button
                onClick={handleAddGuests}
                className="w-full gap-2"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Add Guests
              </Button>
            </CardContent>
          </Card>

          {/* Guest List Card */}
          {guests.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Guest List
                    <Badge variant="secondary" className="ml-2">
                      {guests.length}
                    </Badge>
                  </CardTitle>
                  <Button
                    onClick={handleSendInvitations}
                    disabled={isSending}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSending ? "Sending..." : "Send Invitations"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                        <th className="text-left px-4 sm:px-6 py-4 font-semibold">
                          Email
                        </th>
                        <th className="text-center px-4 sm:px-6 py-4 font-semibold">
                          Event
                        </th>
                        <th className="text-center px-4 sm:px-6 py-4 font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest, index) => (
                        <tr
                          key={guest.id}
                          className={cn(
                            "border-b border-border transition-colors hover:bg-muted/50",
                            index % 2 === 0 ? "bg-background" : "bg-muted/20"
                          )}
                        >
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm sm:text-base font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
                                {guest.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-center">
                            {getEventBadge(guest.eventType)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveGuest(guest.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {guests.length === 0 && (
            <Card className="bg-muted/30">
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  <p className="text-lg text-muted-foreground">
                    No guests added yet
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Start by entering email addresses above to invite your guests
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
