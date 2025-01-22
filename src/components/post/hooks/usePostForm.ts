import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import type { PostForm } from "@/types/post"
import { usePostMedia } from "./usePostMedia"
import { usePlatforms } from "./usePlatforms"
import { supabase } from "@/integrations/supabase/client"

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
    if (step === 1) {
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
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const postToTwitter = async (content: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('twitter', {
        body: { content }
      })
      
      if (error) throw error
      
      console.log('Tweet posted successfully:', data)
      return true
    } catch (error) {
      console.error('Error posting tweet:', error)
      toast({
        title: "Error posting to Twitter",
        description: "There was an error posting your tweet. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const handleSubmit = async (data: PostForm) => {
    const finalData = {
      ...data,
      platforms: selectedPlatforms,
      scheduledDate: date,
      mediaFile,
    }

    console.log("Form submitted:", finalData)
    
    let success = true

    // Post to each selected platform
    if (selectedPlatforms.includes('twitter')) {
      success = await postToTwitter(data.content)
    }

    if (success) {
      // Save to database
      const { error } = await supabase
        .from('posts')
        .insert({
          title: data.title,
          content: data.content,
          post_type: data.postType,
          platforms: selectedPlatforms,
          scheduled_date: date,
          media_url: mediaPreview,
          status: data.postType === 'schedule' ? 'scheduled' : 'published'
        })

      if (error) {
        console.error('Error saving post:', error)
        toast({
          title: "Error saving post",
          description: "Your post was sent but couldn't be saved to your history.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success!",
          description: data.postType === "now" 
            ? "Your post has been published" 
            : `Your post has been scheduled for ${date!.toLocaleDateString()}`,
        })
      }

      handleClose()
    }
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