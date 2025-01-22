import { useState, useEffect } from "react"
import { PostForm } from "@/types/post"

const TWITTER_MAX_CHARS = 280

export const useTwitterValidation = (content: string, mediaPreview: string | null) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const errors: string[] = []
    const contentLength = content.length

    // Validate content length
    setCharCount(contentLength)
    if (contentLength > TWITTER_MAX_CHARS) {
      errors.push(`Content exceeds Twitter's ${TWITTER_MAX_CHARS} character limit`)
    }

    // Validate media if present
    if (mediaPreview) {
      const img = new Image()
      img.onload = () => {
        if (img.width * img.height > 5120 * 5120) {
          errors.push("Image resolution exceeds Twitter's maximum size (5120x5120)")
        }
      }
      img.src = mediaPreview
    }

    setValidationErrors(errors)
  }, [content, mediaPreview])

  return {
    validationErrors,
    charCount,
    TWITTER_MAX_CHARS,
  }
}