import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PlatformSelector } from "./PlatformSelector"
import { MediaUpload } from "./MediaUpload"
import { PostScheduler } from "./PostScheduler"
import type { PostForm } from "@/types/post"
import { ArrowLeft } from "lucide-react"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  postType: z.enum(["now", "schedule"]),
  platforms: z.array(z.string())
})

interface PostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDialog({ open, onOpenChange }: PostDialogProps) {
  const [step, setStep] = useState(1)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()
  const { toast } = useToast()

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      postType: "now",
      platforms: [],
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      setMediaFile(file)
      setMediaPreview(URL.createObjectURL(file))
    }
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleContinue = () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platform selected",
        description: "Please select at least one platform to post to",
        variant: "destructive",
      })
      return
    }

    const { title, content } = form.getValues()
    if (!title || !content) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const onSubmit = async (data: PostForm) => {
    if (data.postType === "schedule" && !date) {
      toast({
        title: "No date selected",
        description: "Please select a date to schedule your post",
        variant: "destructive",
      })
      return
    }

    const finalData = {
      ...data,
      platforms: selectedPlatforms,
      scheduledDate: date,
      mediaFile,
    }

    console.log("Form submitted:", finalData)
    
    toast({
      title: "Success!",
      description: data.postType === "now" 
        ? "Your post has been published" 
        : `Your post has been scheduled for ${date!.toLocaleDateString()}`,
    })

    // Reset form and state
    form.reset()
    setSelectedPlatforms([])
    setMediaFile(null)
    setMediaPreview(null)
    setDate(undefined)
    setStep(1)
    onOpenChange(false)
  }

  const handleClose = () => {
    // Reset form and state when dialog is closed
    form.reset()
    setSelectedPlatforms([])
    setMediaFile(null)
    setMediaPreview(null)
    setDate(undefined)
    setStep(1)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            {step === 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-semibold">Create Post</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Step {step} of 2: {step === 1 ? "Content" : "Schedule"}
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 ? (
              <>
                <PlatformSelector 
                  selectedPlatforms={selectedPlatforms}
                  onPlatformToggle={togglePlatform}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your post title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What would you like to share?" 
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <MediaUpload
                  mediaPreview={mediaPreview}
                  onFileChange={handleFileChange}
                  onRemoveMedia={() => {
                    setMediaFile(null)
                    setMediaPreview(null)
                  }}
                />

                <div className="flex justify-end">
                  <Button type="button" onClick={handleContinue}>
                    Continue
                  </Button>
                </div>
              </>
            ) : (
              <>
                <PostScheduler 
                  form={form}
                  date={date}
                  onDateSelect={setDate}
                />

                <div className="flex justify-end gap-3">
                  <Button type="submit">
                    {form.watch("postType") === "schedule" ? "Schedule Post" : "Post Now"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}