import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UseFormReturn } from "react-hook-form"
import { PostForm } from "@/types/post"
import { Button } from "@/components/ui/button"
import { Twitter, Instagram, Linkedin } from "lucide-react"
import { format } from "date-fns"

interface PreviewStepProps {
  form: UseFormReturn<PostForm>
  selectedPlatforms: string[]
  mediaPreview: string | null
  date?: Date
  onBack: () => void
  onSubmit: () => void
}

export const PreviewStep = ({
  form,
  selectedPlatforms,
  mediaPreview,
  date,
  onBack,
  onSubmit,
}: PreviewStepProps) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-4 h-4" />
      case "instagram":
        return <Instagram className="w-4 h-4" />
      case "linkedin":
        return <Linkedin className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
        <TabsList className="w-full justify-start">
          {selectedPlatforms.map((platform) => (
            <TabsTrigger
              key={platform}
              value={platform}
              className="flex items-center gap-2"
            >
              {getPlatformIcon(platform)}
              <span className="capitalize">{platform}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {selectedPlatforms.map((platform) => (
          <TabsContent key={platform} value={platform} className="space-y-4">
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Preview for {platform}</h3>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">{form.watch("title")}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {form.watch("content")}
                </p>
                {mediaPreview && (
                  <div className="relative w-full max-w-md">
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="rounded-lg w-full"
                    />
                    {/* TODO: Add image editing controls */}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {date && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Scheduled Time</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your post will be published on {format(date, "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          type="button"
          onClick={onSubmit}
          className="bg-[#E86643] hover:bg-[#E86643]/90"
        >
          {form.watch("postType") === "schedule" ? "Schedule Post" : "Post Now"}
        </Button>
      </div>
    </div>
  )
}