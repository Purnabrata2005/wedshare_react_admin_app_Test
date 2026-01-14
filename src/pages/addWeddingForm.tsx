import { type FC,  useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addWeddingRequest, updateWeddingRequest, clearSelection } from "@/redux/slices/weddingSlice"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/ui/navbar"

import { StepIndicator } from "../components/forms/step-indicator"
import { InputField } from "../components/forms/input-field"
import { DateVenueForm } from "../components/forms/dateVenueForm"
import { CheckboxField } from "../components/forms/checkbox-field"
import { InvitationTemplateSelector } from "../components/forms/invitationTemplateSelector"

import { addWeddingFormSchema} from "@/redux/schemas/addWeddingFormSchema"
import type {WeddingFormData } from "@/redux/schemas/addWeddingFormSchema"
const STEP_LABELS = ["Couple Info", "Wedding Details", "Reception Details", "Invitation Card"]

export const AddWeddingForm: FC<any> = ({  }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { weddings, selectedWeddingId } = useAppSelector((s) => s.weddings)
  const userId = useAppSelector((s) => s.auth.user?.userid)

  const selectedWedding = weddings.find(w => w.id === selectedWeddingId || w.weddingId === selectedWeddingId)
  const isEditMode = !!selectedWedding

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<WeddingFormData>({
    resolver: zodResolver(addWeddingFormSchema),
    mode: "onChange",
    defaultValues: {
      groom: "",
      bride: "",
      date: "",
      time: "",
      venue: "",
      receptionSame: true,
      receptionDate: "",
      receptionTime: "",
      receptionVenue: "",
      invitationTemplate: 1,
    },
  })

  const values = watch()

  const onSubmit = (data: WeddingFormData) => {
    setIsSubmitting(true)

    const payload = {
      groomName: data.groom,
      brideName: data.bride,
      weddingDate: data.date,
      weddingTime: data.time,
      weddingVenue: data.venue,
      receptionDate: data.receptionSame ? data.date : data.receptionDate!,
      receptionTime: data.receptionSame ? data.time : data.receptionTime!,
      receptionVenue: data.receptionSame ? data.venue : data.receptionVenue!,
      invitationTemplate: data.invitationTemplate,
    }

    if (isEditMode && selectedWedding) {
      dispatch(updateWeddingRequest({ weddingId: selectedWedding.id || selectedWedding.weddingId!, data: payload }))
    } else {
      dispatch(addWeddingRequest({ ...payload, weddingId: uuidv4(), createdBy: userId ?? "" }))
    }
  }

  return (
    <>
      <Navbar
        title={isEditMode ? "Edit Wedding" : "Add Wedding"}
        showBackButton
        onBackClick={() => {
          dispatch(clearSelection())
          navigate(-1)
        }}
      />

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <StepIndicator steps={STEP_LABELS} currentStep={step} />

          <Card className="p-6 space-y-6">
            {step === 1 && (
              <>
                <Controller name="groom" control={control} render={({ field }) =>
                  <InputField label="Groom Name" {...field} error={errors.groom} />} />
                <Controller name="bride" control={control} render={({ field }) =>
                  <InputField label="Bride Name" {...field} error={errors.bride} />} />

                <Button
                  type="button"
                  onClick={async () => (await trigger(["groom", "bride"])) && setStep(2)}
                  className="w-full"
                >
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <DateVenueForm
                control={control}
                setValue={setValue}
                errors={errors}
                onNext={async () => (await trigger(["date", "time", "venue"])) && setStep(3)}
              />
            )}

            {step === 3 && (
              <>
                <CheckboxField
                  label="Reception same as wedding"
                  checked={values.receptionSame}
                  onChange={(e) => setValue("receptionSame", e.target.checked)}
                />

                {!values.receptionSame && (
                  <DateVenueForm
                    isReception
                    control={control}
                    setValue={setValue}
                    errors={errors}
                  />
                )}

                <Button
                  type="button"
                  onClick={async () => {
                    if (values.receptionSame || await trigger(["receptionDate", "receptionTime", "receptionVenue"])) {
                      setStep(4)
                    }
                  }}
                  className="w-full"
                >
                  Next
                </Button>
              </>
            )}

            {step === 4 && (
              <>
                <InvitationTemplateSelector
                  templates={[]}
                  selectedId={values.invitationTemplate}
                  onSelect={(id) => setValue("invitationTemplate", id)}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  Save and Continue
                </Button>
              </>
            )}
          </Card>

          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
          )}
        </form>
      </div>
    </>
  )
}
