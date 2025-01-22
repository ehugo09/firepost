import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export const usePostMedia = () => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (url: string) => {
    setMediaUrl(url);
  }

  const removeMedia = () => {
    setMediaUrl(null)
  }

  return {
    mediaFile: null, // Keep for backward compatibility
    mediaPreview: mediaUrl,
    handleFileChange,
    removeMedia
  }
}