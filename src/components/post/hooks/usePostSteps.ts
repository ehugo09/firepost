import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export const usePostSteps = (validatePlatforms: () => boolean) => {
  const [step, setStep] = useState(1)
  const { toast } = useToast()

  const handleContinue = (title: string, content: string) => {
    if (step === 1) {
      if (!validatePlatforms()) return
      
      if (!title || !content) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const resetSteps = () => {
    setStep(1)
  }

  return {
    step,
    handleContinue,
    handleBack,
    resetSteps
  }
}