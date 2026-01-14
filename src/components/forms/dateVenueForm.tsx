import type { FC } from "react"
import { useController } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { InputField } from "./input-field"
import { DatePickerField } from "./datePickerField"

interface DateVenueFormProps {
  isReception?: boolean
  control: any
  setValue: any
  errors: any
  onNext?: () => void
  isLoading?: boolean
}

export const DateVenueForm: FC<DateVenueFormProps> = ({
  isReception = false,
  control,
  setValue,
  errors,
  onNext,
  isLoading = false,
}) => {
  const dateField = isReception ? "receptionDate" : "date"
  const venueField = isReception ? "receptionVenue" : "venue"
  const timeField = isReception ? "receptionTime" : "time"

  const dateController = useController({ control, name: dateField })
  const venueController = useController({ control, name: venueField })
  const timeController = useController({ control, name: timeField })

  return (
    <div className="space-y-6">
      <DatePickerField
        label={isReception ? "Reception Date" : "Wedding Date"}
        value={dateController.field.value || ""}
        onChange={(date) => setValue(dateField, date)}
        error={errors?.[dateField]}
        disabled={isLoading}
      />

      <InputField
        label={isReception ? "Reception Venue" : "Wedding Venue"}
        value={venueController.field.value || ""}
        onChange={(e) => setValue(venueField, e.target.value)}
        error={errors?.[venueField]}
        disabled={isLoading}
      />

      <InputField
        label={isReception ? "Reception Time" : "Wedding Time"}
        value={timeController.field.value || ""}
        onChange={(e) => setValue(timeField, e.target.value)}
        error={errors?.[timeField]}
        disabled={isLoading}
      />

      {onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          size="lg"
          className="w-full"
        >
          Next
        </Button>
      )}
    </div>
  )
}
