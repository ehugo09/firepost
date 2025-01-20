import { AppSidebar } from "@/components/AppSidebar"
import { MediaUpload } from "@/components/post/MediaUpload"
import { PlatformSelector } from "@/components/post/PlatformSelector"
import { PostScheduler } from "@/components/post/PostScheduler"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { PostForm } from "@/types/post"
import { useForm } from "react-hook-form"
import { useState } from "react"

export default function Post() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [content, setContent] = useState("")
  const [date, setDate] = useState<Date>()
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const { toast } = useToast()
  const form = useForm<PostForm>({
    defaultValues: {
      content: "",
      postType: "now",
      platforms: [],
    },
  })

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
      description: date 
        ? `Post scheduled for ${date.toLocaleDateString()}` 
        : "Post published successfully",
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveMedia = () => {
    setMediaPreview(null)
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-6">
        <Card className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Create Post</h1>
          
          <Form {...form}>
            <div className="space-y-6">
              <PlatformSelector 
                selectedPlatforms={selectedPlatforms}
                onPlatformToggle={handlePlatformToggle}
              />

              <MediaUpload 
                mediaPreview={mediaPreview}
                onFileChange={handleFileChange}
                onRemoveMedia={handleRemoveMedia}
              />

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
                form={form}
                date={date}
                onDateSelect={setDate}
              />

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setContent("")}>
                  Clear
                </Button>
                <Button onClick={handlePost}>
                  {date ? "Schedule Post" : "Post Now"}
                </Button>
              </div>
            </div>
          </Form>
        </Card>
      </main>
    </div>
  )
}