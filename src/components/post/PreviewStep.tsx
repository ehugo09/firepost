import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UseFormReturn } from "react-hook-form"
import { PostForm } from "@/types/post"
import { Button } from "@/components/ui/button"
import { Twitter, Instagram, Linkedin } from "lucide-react"
import { TwitterPreview } from "./previews/TwitterPreview"

interface PreviewStepProps {
  form: UseFormReturn<PostForm>
  selectedPlatforms: string[]
  mediaPreview: string | null
  date?: Date
  onBack: () => void
  onSubmit: (data: PostForm) => void
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

  const renderPlatformPreview = (platform: string) => {
    switch (platform) {
      case "twitter":
        return (
          <TwitterPreview 
            data={form.getValues()} 
            mediaPreview={mediaPreview}
          />
        )
      case "instagram":
        return (
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Instagram Preview</h3>
            <p className="text-sm text-gray-600">
              Instagram preview coming soon...
            </p>
          </div>
        )
      case "linkedin":
        return (
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">LinkedIn Preview</h3>
            <p className="text-sm text-gray-600">
              LinkedIn preview coming soon...
            </p>
          </div>
        )
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
            {renderPlatformPreview(platform)}
          </TabsContent>
        ))}
      </Tabs>

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
          onClick={() => onSubmit(form.getValues())}
          className="bg-[#E86643] hover:bg-[#E86643]/90"
          disabled={form.formState.isSubmitting}
        >
          {form.watch("postType") === "schedule" ? "Schedule Post" : "Post Now"}
        </Button>
      </div>
    </div>
  )
}