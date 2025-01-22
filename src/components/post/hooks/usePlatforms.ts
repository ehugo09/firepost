import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export const usePlatforms = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const { toast } = useToast()

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const validatePlatforms = () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platform selected",
        description: "Please select at least one platform to post to",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  return {
    selectedPlatforms,
    togglePlatform,
    validatePlatforms
  }
}