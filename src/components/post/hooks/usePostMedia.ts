import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export const usePostMedia = () => {
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      setMediaFile(file)
      setMediaPreview(URL.createObjectURL(file))
    }
  }

  const removeMedia = () => {
    setMediaFile(null)
    setMediaPreview(null)
  }

  return {
    mediaFile,
    mediaPreview,
    handleFileChange,
    removeMedia
  }
}