import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { PostForm } from "@/types/post"
import { usePostMedia } from "./usePostMedia"
import { usePlatforms } from "./usePlatforms"
import { usePostSteps } from "./usePostSteps"
import { usePostSubmission } from "./usePostSubmission"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  postType: z.enum(["now", "schedule"]),
  platforms: z.array(z.string())
})

export const usePostForm = (onClose: () => void) => {
  const [date, setDate] = useState<Date>()
  
  const { mediaFile, mediaPreview, handleFileChange, removeMedia } = usePostMedia()
  const { selectedPlatforms, togglePlatform, validatePlatforms } = usePlatforms()
  const { step, handleContinue, handleBack, resetSteps } = usePostSteps(validatePlatforms)
  const { handleSubmit: submitPost } = usePostSubmission()

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      postType: "now",
      platforms: [],
    },
  })

  const handleContinueClick = () => {
    const { title, content } = form.getValues()
    handleContinue(title, content)
  }

  const handleSubmit = async (data: PostForm) => {
    const success = await submitPost(data, selectedPlatforms, date, mediaPreview)
    if (success) {
      handleClose()
    }
  }

  const handleClose = () => {
    form.reset()
    resetSteps()
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
    handleContinue: handleContinueClick,
    handleBack,
    handleSubmit,
    handleClose,
    setDate,
    removeMedia
  }
}