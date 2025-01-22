import { UseFormReturn, useWatch } from "react-hook-form"
import { PostForm } from "@/types/post"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Twitter, Instagram, Linkedin } from "lucide-react"
import { TwitterPreview } from "./previews/TwitterPreview"
import { InstagramPreview } from "./previews/InstagramPreview"
import { LinkedInPreview } from "./previews/LinkedInPreview"

interface PreviewPanelProps {
  form: UseFormReturn<PostForm>
  selectedPlatforms: string[]
  mediaPreview: string | null
  date?: Date
}

export function PreviewPanel({
  form,
  selectedPlatforms,
  mediaPreview,
  date,
}: PreviewPanelProps) {
  // Watch for form changes in real-time
  const formValues = useWatch({
    control: form.control,
  })

  if (selectedPlatforms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a platform to see preview
      </div>
    )
  }

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
  } as const

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Preview</h3>
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
          const Preview = platformConfig[platform as keyof typeof platformConfig]?.component
          
          return (
            <TabsContent key={platform} value={platform} className="space-y-4">
              {Preview && (
                <Preview 
                  data={{
                    ...formValues,
                    scheduledDate: date
                  }} 
                  mediaPreview={mediaPreview}
                />
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}