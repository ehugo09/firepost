import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import type { PostForm } from "@/types/post"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  postType: z.enum(["now", "schedule"]),
  platforms: z.array(z.string())
})

export const usePostForm = (onClose: () => void) => {
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

  const handleSubmit = async (data: PostForm) => {
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
    onClose()
  }

  return {
    step,
    form,
    selectedPlatforms,
    mediaPreview,
    date,
    handleFileChange,
    togglePlatform,
    handleContinue,
    handleBack,
    handleSubmit,
    handleClose,
    setDate,
    removeMedia: () => {
      setMediaFile(null)
      setMediaPreview(null)
    }
  }
}