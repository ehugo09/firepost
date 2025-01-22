import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UseFormReturn } from "react-hook-form"
import { PostForm } from "@/types/post"
import { Button } from "@/components/ui/button"
import { Twitter, Instagram, Linkedin } from "lucide-react"
import { TwitterPreview } from "./previews/TwitterPreview"
import { InstagramPreview } from "./previews/InstagramPreview"
import { LinkedInPreview } from "./previews/LinkedInPreview"

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
  const platformConfig = {
    twitter: {
      icon: <Twitter className="w-4 h-4" />,
      component: TwitterPreview,
    },
    instagram: {
      icon: <Instagram className="w-4 h-4" />,
      component: InstagramPreview,
    },
    linkedin: {
      icon: <Linkedin className="w-4 h-4" />,
      component: LinkedInPreview,
    },
  } as const;

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
              {platformConfig[platform as keyof typeof platformConfig]?.icon}
              <span className="capitalize">{platform}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {selectedPlatforms.map((platform) => {
          const Preview = platformConfig[platform as keyof typeof platformConfig]?.component;
          
          return (
            <TabsContent key={platform} value={platform} className="space-y-4">
              {Preview && (
                <Preview 
                  data={{
                    ...form.getValues(),
                    scheduledDate: date
                  }} 
                  mediaPreview={mediaPreview}
                />
              )}
            </TabsContent>
          );
        })}
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
        >
          {form.watch("postType") === "schedule" ? "Schedule Post" : "Post Now"}
        </Button>
      </div>
    </div>
  );
};