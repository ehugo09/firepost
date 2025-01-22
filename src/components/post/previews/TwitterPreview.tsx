import { PostForm } from "@/types/post"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTwitterValidation } from "../hooks/useTwitterValidation"
import { useTwitterProfile } from "../hooks/useTwitterProfile"

interface TwitterPreviewProps {
  data: PostForm & { scheduledDate?: Date }
  mediaPreview: string | null
}

export function TwitterPreview({ data, mediaPreview }: TwitterPreviewProps) {
  const { validationErrors, charCount, TWITTER_MAX_CHARS } = useTwitterValidation(
    data.content,
    mediaPreview
  )

  const { data: profile } = useTwitterProfile()

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

      <Card className="p-4 w-[500px]">
        <div className="flex gap-3">
          <Avatar className="w-12 h-12 shrink-0">
            {profile?.profile_picture && (
              <img 
                src={profile.profile_picture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold truncate">{profile?.username || "Your Name"}</span>
              <span className="text-gray-500 text-sm truncate">@{profile?.username || "username"}</span>
            </div>
            
            <div className="space-y-3">
              <p className="whitespace-pre-wrap break-words text-[15px] leading-normal">
                {data.content}
              </p>
              
              {mediaPreview && (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-[16/9] max-h-[280px]">
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <Badge variant="secondary" className="rounded-full">
                {charCount}/{TWITTER_MAX_CHARS}
              </Badge>
              {data.postType === "schedule" && data.scheduledDate && (
                <span className="truncate">
                  Scheduled for {data.scheduledDate.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}