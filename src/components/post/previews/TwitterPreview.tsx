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

  const { data: profile, isLoading } = useTwitterProfile()

  // Format the content to match Twitter's mobile display
  const formattedContent = data.content
    .split('\n')
    .map(line => line.trim())
    .join('\n')

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

      <Card className="p-4 w-[350px]">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 shrink-0 rounded-full overflow-hidden">
            {profile?.profile_picture && (
              <img 
                src={profile.profile_picture} 
                alt={profile.username || "Profile"} 
                className="w-full h-full object-cover"
              />
            )}
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[15px] leading-5 truncate">
                {profile?.username || "Loading..."}
              </span>
              <span className="text-muted-foreground text-[15px]">
                @{profile?.username || "username"}
              </span>
            </div>
            
            <div className="mt-1 space-y-3">
              <p className="text-[15px] leading-[1.3125] whitespace-pre-wrap break-words">
                {formattedContent}
              </p>
              
              {mediaPreview && (
                <div className="mt-3 rounded-2xl overflow-hidden">
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="rounded-full text-xs px-2 py-0.5">
                  {charCount}/{TWITTER_MAX_CHARS}
                </Badge>
                {data.postType === "schedule" && data.scheduledDate && (
                  <span className="text-xs">
                    Scheduled for {data.scheduledDate.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}