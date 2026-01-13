import { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Mail, Trash2, Users, Send, Plus, X } from "lucide-react"
import { toast } from "sonner"

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
  resetInviteState,
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

  const { guests, loading: isSending, success, error } = useAppSelector(
    (state) => state.invite
  )
  const { weddings, selectedWedding } = useAppSelector(
    (state) => state.weddings
  )

  useEffect(() => {
    if (success) {
      toast.success("Invitations sent successfully!")
      dispatch(resetInviteState())
    }
  }, [success, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(`Failed to send invitations: ${error}`)
      dispatch(resetInviteState())
    }
  }, [error, dispatch])

  const state = location.state as LocationState | null
  const weddingId = state?.weddingId || ""

  const wedding = useMemo(() => {
    if (
      selectedWedding &&
      (selectedWedding.weddingId === weddingId ||
        selectedWedding.id === weddingId)
    ) {
      return selectedWedding
    }
    return (
      weddings.find(
        (w) => w.weddingId === weddingId || w.id === weddingId
      ) || null
    )
  }, [selectedWedding, weddings, weddingId])

  const weddingData: InviteWeddingData = useMemo(
    () => ({
      weddingId: wedding?.weddingId || wedding?.id || "",
      bride_name: wedding?.brideName || "",
      groom_name: wedding?.groomName || "",
      wedding_date: formatDateDDMMYYYY(wedding?.weddingDate),
      wedding_time: wedding?.weddingTime || "",
      wedding_venue: wedding?.weddingVenue || "",
      reception_date: formatDateDDMMYYYY(wedding?.receptionDate),
      reception_time: wedding?.receptionTime || "",
      reception_venue: wedding?.receptionVenue || "",
    }),
    [wedding]
  )

  if (!weddingId) {
    navigate("/dashboard", { replace: true })
  }

  const [guestEmails, setGuestEmails] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [eventType, setEventType] = useState<
    "marriage" | "reception" | "both"
  >("both")
  const [emailError, setEmailError] = useState("")

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  /* ================================
     MOBILE SAFE EMAIL SEPARATION
     ================================ */

  const handleInputChange = (value: string) => {
    setInputValue(value)

    if (!/[,\s]/.test(value)) return

    const parts = value.split(/[,\s]+/)
    const remaining = parts.pop() ?? ""

    const newEmails: string[] = []

    parts.forEach((email) => {
      const normalized = email.trim().toLowerCase()
      if (!normalized) return

      if (!isValidEmail(normalized)) {
        setEmailError(`Invalid email: ${normalized}`)
        return
      }

      if (
        guestEmails.includes(normalized) ||
        newEmails.includes(normalized)
      ) {
        setEmailError(`Duplicate email skipped: ${normalized}`)
        return
      }

      newEmails.push(normalized)
    })

    if (newEmails.length > 0) {
      setGuestEmails((prev) => [...prev, ...newEmails])
      setEmailError("")
    }

    setInputValue(remaining)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    handleInputChange(e.clipboardData.getData("text") + " ")
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      handleInputChange(inputValue + " ")
    }
  }

  const removeEmail = (email: string) => {
    setGuestEmails((prev) => prev.filter((e) => e !== email))
  }

  const handleAddGuests = () => {
    if (guestEmails.length === 0) {
      setEmailError("Please add at least one email address")
      return
    }

    const newGuests: GuestItem[] = guestEmails.map((email) => ({
      id: Date.now() + Math.random(),
      email,
      eventType,
    }))

    dispatch(addGuests(newGuests))
    setGuestEmails([])
    setInputValue("")
    setEmailError("")
  }

  const handleRemoveGuest = (id: number) => {
    dispatch(removeGuest(id))
  }

  const getEmailType = (
    type: "marriage" | "reception" | "both"
  ): EmailTypeValue => {
    switch (type) {
      case "marriage":
        return EmailType.MARRIAGE
      case "reception":
        return EmailType.RECEPTION
      default:
        return EmailType.BOTH
    }
  }

  const handleSendInvitations = () => {
    if (guests.length === 0) return

    const grouped: { [key: number]: EmailObject } = {}

    guests.forEach((guest) => {
      const emailType = getEmailType(guest.eventType)
      if (!grouped[emailType]) {
        grouped[emailType] = { emailType, body: [] }
      }
      grouped[emailType].body.push({ to: guest.email })
    })

    dispatch(
      sendInvitationAction({
        emails: Object.values(grouped),
        data: weddingData,
      })
    )
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
      <Navbar
        title="Invite Guests"
        subtitle="Send invitations to your wedding guests"
        showBackButton
        onBackClick={() => navigate(-1)}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Enter Guest Emails
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border">
              {guestEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border text-sm"
                >
                  {email}
                  <button onClick={() => removeEmail(email)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <input
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onPaste={handlePaste}
                onBlur={handleBlur}
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="Type email, use space or comma"
                className="flex-1 min-w-[150px] outline-none bg-transparent"
              />
            </div>

            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}

            <Button
              onClick={handleAddGuests}
              disabled={guestEmails.length === 0}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Guests ({guestEmails.length})
            </Button>
          </CardContent>
        </Card>

        {guests.length > 0 && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Guest List
              </CardTitle>
              <Button
                onClick={handleSendInvitations}
                disabled={isSending}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? "Sending..." : "Send"}
              </Button>
            </CardHeader>

            <CardContent>
              <table className="w-full">
                <tbody>
                  {guests.map((guest) => (
                    <tr key={guest.id} className="border-b">
                      <td className="py-3">{guest.email}</td>
                      <td className="text-center">
                        {getEventBadge(guest.eventType)}
                      </td>
                      <td className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveGuest(guest.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
