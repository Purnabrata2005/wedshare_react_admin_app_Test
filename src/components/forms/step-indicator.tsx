import type { FC } from "react"
import { Check } from "lucide-react"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export const StepIndicator: FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((label, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              index + 1 === currentStep
                ? "bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-110"
                : index + 1 < currentStep
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1 < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <p
            className={`text-xs mt-2 text-center hidden sm:block transition-colors ${
              index + 1 <= currentStep
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
