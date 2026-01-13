import { type FC, useEffect, useRef, useState } from "react"
import { useForm, type SubmitHandler, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addWeddingRequest, updateWeddingRequest, clearSelection } from "@/redux/slices/weddingSlice"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/ui/navbar"
import { StepIndicator } from "../components/forms/step-indicator"
import { InputField } from "../components/forms/input-field"
import { DateVenueForm } from "../components/forms/dateVenueForm"
import { CheckboxField } from "../components/forms/checkbox-field"
import { InvitationTemplateSelector, type InvitationTemplate } from "../components/forms/invitationTemplateSelector"
import { weddingSchema } from "@/redux/schemas/weddingSchemas"

const WEDDING_TEMPLATES: InvitationTemplate[] = [
  {
    id: 1,
    title: "Classic Elegance",
    text: "You are invited to witness the union of [Bride] and [Groom] on [Date] at [Venue].",
  },
  {
    id: 2,
    title: "Modern Minimalist",
    text: "Join us as we celebrate the wedding of [Groom] & [Bride]. Date: [Date]. Location: [Venue]. Reception details to follow.",
  },
  {
    id: 3,
    title: "Floral Romance",
    text: "With joyous hearts, we invite you to our wedding ceremony. [Bride] and [Groom] await your presence. [Date], [Venue].",
  },
]

const addWeddingFormSchema = z.object({
  groom: weddingSchema.shape.groomName,
  bride: weddingSchema.shape.brideName,
  date: weddingSchema.shape.weddingDate,
  time: weddingSchema.shape.weddingTime,
  venue: weddingSchema.shape.weddingVenue,
  receptionSame: z.boolean(),
  receptionDate: weddingSchema.shape.receptionDate,
  receptionTime: weddingSchema.shape.receptionTime,
  receptionVenue: weddingSchema.shape.receptionVenue,
  invitationTemplate: z.number().min(1, "Invitation template is required"),
})

type WeddingFormData = z.infer<typeof addWeddingFormSchema>

interface AddWeddingFormProps {
  onSave: (data: any) => void
  onBack: () => void
}

const STEP_LABELS = ["Couple Info", "Wedding Details", "Reception Details", "Invitation Card"]
const STEP_COUNT = STEP_LABELS.length

// Helper function to convert ISO date to yyyy-mm-dd format
const convertDateToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return ""

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }

  if (dateString.includes("T")) {
    return dateString.split("T")[0]
  }

  try {
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) {
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, "0")
      const day = String(date.getUTCDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }
  } catch {
    // Return original if parsing fails
  }

  return dateString
}

export const AddWeddingForm: FC<AddWeddingFormProps> = ({ onSave, onBack }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.auth.user?.userid)
  const { weddings, selectedWeddingId } = useAppSelector((state) => state.weddings)
  
  const selectedWedding = weddings.find(
    (w) => w.weddingId === selectedWeddingId || w.id === selectedWeddingId
  )
  const isEditMode = !!selectedWedding

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const lastWeddingIdRef = useRef<string | null>(null)
  const canSubmitRef = useRef(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
    trigger,
  } = useForm<WeddingFormData>({
    mode: "onChange",
    resolver: zodResolver(addWeddingFormSchema),
    defaultValues: {
      groom: "",
      bride: "",
      date: "",
      time: "07:00 PM",
      venue: "",
      receptionSame: true,
      receptionDate: "",
      receptionTime: "07:00 PM",
      receptionVenue: "",
      invitationTemplate: WEDDING_TEMPLATES[0].id,
    },
  })

  // Initialize form data from selectedWedding when in edit mode
  useEffect(() => {
    if (isEditMode && selectedWedding) {
      reset({
        groom: selectedWedding.groomName || "",
        bride: selectedWedding.brideName || "",
        date: convertDateToYYYYMMDD(selectedWedding.weddingDate || ""),
        time: selectedWedding.weddingTime || "10:00 AM",
        venue: selectedWedding.weddingVenue || "",
        receptionSame:
          selectedWedding.receptionDate === selectedWedding.weddingDate &&
          selectedWedding.receptionVenue === selectedWedding.weddingVenue,
        receptionDate: convertDateToYYYYMMDD(selectedWedding.receptionDate || ""),
        receptionTime: selectedWedding.receptionTime || "07:00 PM",
        receptionVenue: selectedWedding.receptionVenue || "",
        invitationTemplate: selectedWedding.invitationTemplate || WEDDING_TEMPLATES[0].id,
      })
    }
  }, [isEditMode, selectedWedding, reset])

  const formValues = watch()

  // Track previous loading state to detect when save/update is complete
  const prevLoadingRef = useRef(false)
  const { loading: weddingsLoading } = useAppSelector((state) => state.weddings)

  // Monitor weddings state to detect when save/update is complete
  useEffect(() => {
    if (!isSubmitting || !lastWeddingIdRef.current) {
      prevLoadingRef.current = weddingsLoading
      return
    }

    // For new weddings - check if the wedding exists in the list
    // For updates - check if loading changed from true to false (update completed)
    const found = weddings.some((w) => w.weddingId === lastWeddingIdRef.current)
    const loadingTransitioned = prevLoadingRef.current && !weddingsLoading
    const updateCompleted = isEditMode && loadingTransitioned
    const createCompleted = !isEditMode && loadingTransitioned
     
    if (found || updateCompleted || createCompleted) {
      const wedding =
        weddings.find((w) => w.weddingId === lastWeddingIdRef.current) ||
        weddings.find((w) => (w.id || w.weddingId) === lastWeddingIdRef.current) ||
        weddings.find(
          (w) =>
            w.groomName === formValues.groom &&
            w.brideName === formValues.bride &&
            w.weddingDate === formValues.date
        ) ||
        null
       setIsSubmitting(false)
       lastWeddingIdRef.current = null
       onSave(wedding)
     }
     
     prevLoadingRef.current = weddingsLoading
  }, [weddings, isSubmitting, onSave, isEditMode, weddingsLoading, formValues.bride, formValues.groom, formValues.date])

  const handleFormSubmit: SubmitHandler<WeddingFormData> = (data) => {
    // Only navigate steps, never submit until explicitly on final step
    if (step !== STEP_COUNT) {
      setStep(step + 1)
      return
    }

    // Guard against auto-submission - only submit if explicitly triggered
    if (!canSubmitRef.current) {
      return
    }
    canSubmitRef.current = false

    // Final submission - only happens on step 4
    setIsSubmitting(true)

    const template = WEDDING_TEMPLATES.find((t) => t.id === data.invitationTemplate)
    const invitationText = template
      ? template.text
          .replace(/\[Bride\]/g, data.bride)
          .replace(/\[Groom\]/g, data.groom)
          .replace(/\[Date\]/g, data.date)
          .replace(/\[Venue\]/g, data.venue)
      : ""

    if (isEditMode && selectedWedding) {
      // Update existing wedding
      const updatePayload = {
        groomName: data.groom,
        brideName: data.bride,
        weddingDate: data.date,
        weddingVenue: data.venue,
        weddingTime: data.time,
        receptionDate: data.receptionSame ? data.date : data.receptionDate,
        receptionVenue: data.receptionSame ? data.venue : data.receptionVenue,
        receptionTime: data.receptionSame ? data.time : data.receptionTime,
        invitationTemplate: data.invitationTemplate,
        invitationText,
      }

      dispatch(
        updateWeddingRequest({
          weddingId: selectedWedding.weddingId || selectedWedding.id || "",
          data: updatePayload,
        })
      )
      lastWeddingIdRef.current = selectedWedding.weddingId || selectedWedding.id || ""
    } else {
      // Create new wedding
      const weddingId = uuidv4()
      const payload = {
        weddingId,
        groomName: data.groom,
        brideName: data.bride,
        weddingDate: data.date,
        weddingVenue: data.venue,
        weddingTime: data.time,
        receptionDate: data.receptionSame ? data.date : data.receptionDate,
        receptionVenue: data.receptionSame ? data.venue : data.receptionVenue,
        receptionTime: data.receptionSame ? data.time : data.receptionTime,
        invitationTemplate: data.invitationTemplate,
        invitationText,
        coverImageKey: "",
        createdBy: userId ?? "",
      }

      dispatch(addWeddingRequest(payload))
      lastWeddingIdRef.current = weddingId
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <Controller
              name="groom"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Groom's Name"
                  placeholder="e.g., John"
                  {...field}
                  error={errors.groom}
                  disabled={isSubmitting}
                />
              )}
            />

            <Controller
              name="bride"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Bride's Name"
                  placeholder="e.g., Sarah"
                  {...field}
                  error={errors.bride}
                  disabled={isSubmitting}
                />
              )}
            />

            <Button
              type="button"
              onClick={async () => {
                const isValid = await trigger(["groom", "bride"])
                if (isValid) {
                  setStep(2)
                }
              }}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              Next
            </Button>
          </div>
        )

      case 2:
        return (
          <DateVenueForm
            control={control}
            setValue={setValue}
            errors={errors}
            onNext={async () => {
              const isValid = await trigger(["date", "time", "venue"])
              if (isValid) {
                setStep(3)
              }
            }}
            isLoading={isSubmitting}
          />
        )

      case 3:
        return (
          <div className="space-y-6">
            <CheckboxField
              label="Reception same as wedding date and venue"
              checked={formValues.receptionSame}
              onChange={(e) => {
                setValue("receptionSame", e.target.checked)
                if (e.target.checked) {
                  setValue("receptionDate", formValues.date)
                  setValue("receptionVenue", formValues.venue)
                  setValue("receptionTime", formValues.time)
                }
              }}
              disabled={isSubmitting}
            />

            {!formValues.receptionSame && (
              <DateVenueForm
                isReception
                control={control}
                setValue={setValue}
                errors={errors}
                isLoading={isSubmitting}
              />
            )}

            <Button
              type="button"
              onClick={async () => {
                if (formValues.receptionSame) {
                  setStep(4)
                } else {
                  const isValid = await trigger(["receptionDate", "receptionTime", "receptionVenue"])
                  if (isValid) {
                    setStep(4)
                  }
                }
              }}
              disabled={
                isSubmitting ||
                (!formValues.receptionSame && (!formValues.receptionDate || !formValues.receptionVenue || !!errors.receptionDate || !!errors.receptionVenue))
              }
              className="w-full"
              size="lg"
            >
              Next
            </Button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              Choose Invitation Card Template
            </h3>

            <InvitationTemplateSelector
              templates={WEDDING_TEMPLATES}
              selectedId={formValues.invitationTemplate}
              onSelect={(templateId) => setValue("invitationTemplate", templateId)}
              preview={{
                value: {
                  bride: formValues.bride,
                  groom: formValues.groom,
                  date: formValues.date,
                  venue: formValues.venue,
                }
              }}
            />

            <Button
              type="button"
              onClick={async () => {
                const isValid = await trigger("invitationTemplate")
                if (isValid) {
                  canSubmitRef.current = true
                  handleSubmit(handleFormSubmit)()
                }
              }}
              disabled={isSubmitting}
              className="w-full mt-6"
              size="lg"
            >
              {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Wedding" : "Save and Continue"}
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Navbar
        title={isEditMode ? "Edit Wedding" : "Add Wedding"}
        subtitle={isEditMode ? "Update wedding details" : "Create a new wedding event"}
        showBackButton={true}
        onBackClick={() => {
          if (isEditMode) {
            dispatch(clearSelection())
          }
          navigate(-1)
        }}
      />

      <div className="max-w-2xl mx-auto p-6">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          onKeyDown={(e) => {
            // Prevent Enter from submitting before final step
            if (e.key === "Enter" && step !== STEP_COUNT) {
              e.preventDefault()
            }
          }}
          className="space-y-8"
        >
          {/* Step Indicator */}
          <StepIndicator steps={STEP_LABELS} currentStep={step} />

          {/* Step Content */}
          <Card className="p-6">
            {getStepContent()}
          </Card>

          {/* Back Button */}
          {step > 1 && (
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                disabled={isSubmitting}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </Button>
              {isEditMode && (
                <Button
                  type="button"
                  onClick={() => {
                    dispatch(clearSelection())
                    onBack()
                  }}
                  disabled={isSubmitting}
                  variant="ghost"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </>
  )
}
