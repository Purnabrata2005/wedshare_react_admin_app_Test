import type { FC } from "react"
import { useController, type UseFormSetValue, type FieldValues } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { InputField } from "./input-field"
import { DatePickerField } from "./datePickerField"

interface DateVenueFormProps<T extends FieldValues> {
  isReception?: boolean
  control: any
  setValue: UseFormSetValue<T>
  errors: Record<string, any>
  onNext?: () => void
  isLoading?: boolean
}

export const DateVenueForm: FC<DateVenueFormProps<any>> = ({
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

  const dateController = useController({
    control,
    name: dateField,
    rules: {
      required: `${isReception ? "Reception" : "Wedding"} date is required`,
      validate: {
        isValidDate: (value) => !isNaN(new Date(value).getTime()) || "Invalid date format",
      },
    }
  })

  const venueController = useController({
    control,
    name: venueField,
    rules: {
      required: `${isReception ? "Reception" : "Wedding"} venue is required`,
      minLength: { value: 1, message: `${isReception ? "Reception" : "Wedding"} venue must be at least 1 character` },
      validate: {
        lettersAndSpacesOnly: (value) => {
          // Only validate pattern for wedding venue, not reception venue
          if (!isReception && !/^[a-zA-Z\s]+$/.test(value)) {
            return "Wedding venue can only contain letters and spaces";
          }
          return true;
        },
        noTrailingSpaces: (value) => {
          const trimmedValue = value.trim();
          if (trimmedValue !== value) {
            setValue(venueField, trimmedValue);
          }
          return true;
        }
      }
    }
  })

  const timeController = useController({
    control,
    name: timeField,
    rules: {
      required: `${isReception ? "Reception" : "Wedding"} time is required`,
    }
  })

  return (
    <div className="space-y-6">
      <DatePickerField
        label={isReception ? "Reception Date" : "Wedding Date"}
        value={dateController.field.value || ""}
        onChange={(date) => setValue(dateField as any, date)}
        error={dateController.fieldState.error?.message || errors[dateField]}
        disabled={isLoading}
      />

      <InputField
        label={isReception ? "Reception Venue" : "Wedding Venue"}
        placeholder="Enter location (e.g., The Grand Ballroom)"
        value={venueController.field.value || ""}
        onChange={(e) => setValue(venueField as any, e.target.value)}
        error={venueController.fieldState.error?.message || errors[venueField]}
        disabled={isLoading}
      />

      <InputField
        label={isReception ? "Reception Time" : "Wedding Time"}
        type="text"
        placeholder="e.g., 10:00 AM"
        value={timeController.field.value || ""}
        onChange={(e) => setValue(timeField as any, e.target.value)}
        error={timeController.fieldState.error?.message || errors[timeField]}
        disabled={isLoading}
      />

      {onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={
            isLoading || 
            !dateController.field.value || 
            !venueController.field.value || 
            !timeController.field.value || 
            dateController.fieldState.invalid || 
            venueController.fieldState.invalid || 
            timeController.fieldState.invalid
          }
          size="lg"
          className="w-full"
        >
          Next
        </Button>
      )}
    </div>
  )
}