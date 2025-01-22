import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export const usePostMedia = () => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (url: string) => {
    console.log("Setting media URL:", url);
    setMediaUrl(url);
  }

  const removeMedia = () => {
    console.log("Removing media");
    setMediaUrl(null)
  }

  return {
    mediaFile: null,
    mediaPreview: mediaUrl,
    handleFileChange,
    removeMedia
  }
}