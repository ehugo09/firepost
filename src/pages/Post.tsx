import { AppSidebar } from "@/components/AppSidebar"
import { MediaUpload } from "@/components/post/MediaUpload"
import { PlatformSelector } from "@/components/post/PlatformSelector"
import { PostScheduler } from "@/components/post/PostScheduler"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

export default function Post() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [content, setContent] = useState("")
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const { toast } = useToast()

  const handlePost = async () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post",
        variant: "destructive",
      })
      return
    }

    // Handle post creation logic here
    toast({
      title: "Success",
      description: scheduledDate 
        ? `Post scheduled for ${scheduledDate.toLocaleDateString()}` 
        : "Post published successfully",
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Card className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Create Post</h1>
          
          <div className="space-y-6">
            <PlatformSelector 
              selectedPlatforms={selectedPlatforms}
              onPlatformsChange={setSelectedPlatforms}
            />

            <MediaUpload />

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <PostScheduler 
              scheduledDate={scheduledDate}
              onScheduleChange={setScheduledDate}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setContent("")}>
                Clear
              </Button>
              <Button onClick={handlePost}>
                {scheduledDate ? "Schedule Post" : "Post Now"}
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
