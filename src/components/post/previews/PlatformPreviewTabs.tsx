import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostForm } from "@/types/post"
import { platformConfig } from "../config/platformConfig"

interface PlatformPreviewTabsProps {
  selectedPlatforms: string[]
  data: PostForm & { scheduledDate?: Date }
  mediaPreview: string | null
}

export const PlatformPreviewTabs = ({
  selectedPlatforms,
  data,
  mediaPreview,
}: PlatformPreviewTabsProps) => {
  if (selectedPlatforms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a platform to see preview
      </div>
    )
  }

  return (
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
                data={data}
                mediaPreview={mediaPreview}
              />
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}