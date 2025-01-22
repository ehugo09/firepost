import { PostForm } from "@/types/post"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"

interface TwitterPreviewProps {
  data: PostForm
  mediaPreview: string | null
}

const TWITTER_MAX_CHARS = 280

export function TwitterPreview({ data, mediaPreview }: TwitterPreviewProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const errors: string[] = []
    const contentLength = data.content.length

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
  }, [data.content, mediaPreview])

  return (
    <div className="space-y-4">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-4 max-w-[598px]">
        <div className="flex gap-3">
          <Avatar className="w-12 h-12">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold">Your Name</span>
              <span className="text-gray-500">@username</span>
            </div>
            
            <div className="space-y-3">
              <p className="whitespace-pre-wrap">{data.content}</p>
              
              {mediaPreview && (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200">
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[512px] object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <Badge variant="secondary" className="rounded-full">
                {charCount}/{TWITTER_MAX_CHARS}
              </Badge>
              {data.postType === "schedule" && data.scheduledDate && (
                <span>
                  Scheduled for {new Date(data.scheduledDate).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}