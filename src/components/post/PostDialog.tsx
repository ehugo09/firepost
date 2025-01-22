import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import type { PostForm } from "@/types/post"
import { PostDialogHeader } from "./PostDialogHeader"
import { PostContentStep } from "./PostContentStep"
import { PostScheduleStep } from "./PostScheduleStep"

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

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
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

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
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

    handleClose()
  }

  const handleClose = () => {
    form.reset()
    setSelectedPlatforms([])
    setMediaFile(null)
    setMediaPreview(null)
    setDate(undefined)
    setStep(1)
    onOpenChange(false)
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleClose}
      modal
    >
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <PostDialogHeader step={step} onBack={handleBack} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 ? (
              <PostContentStep
                form={form}
                selectedPlatforms={selectedPlatforms}
                onPlatformToggle={togglePlatform}
                mediaPreview={mediaPreview}
                onFileChange={handleFileChange}
                onRemoveMedia={() => {
                  setMediaFile(null)
                  setMediaPreview(null)
                }}
                onContinue={handleContinue}
              />
            ) : (
              <PostScheduleStep
                form={form}
                date={date}
                onDateSelect={setDate}
              />
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}