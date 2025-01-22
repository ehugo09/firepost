import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import type { PostForm } from "@/types/post"
import { usePostMedia } from "./usePostMedia"
import { usePlatforms } from "./usePlatforms"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  postType: z.enum(["now", "schedule"]),
  platforms: z.array(z.string())
})

export const usePostForm = (onClose: () => void) => {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>()
  const { toast } = useToast()
  
  const { mediaFile, mediaPreview, handleFileChange, removeMedia } = usePostMedia()
  const { selectedPlatforms, togglePlatform, validatePlatforms } = usePlatforms()

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      postType: "now",
      platforms: [],
    },
  })

  const handleContinue = () => {
    if (!validatePlatforms()) return
    
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
    if (step !== 2) return

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
    setStep(1)
    setDate(undefined)
    removeMedia()
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
    removeMedia
  }
}