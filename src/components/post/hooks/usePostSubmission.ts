import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { PostForm } from "@/types/post"

export const usePostSubmission = () => {
  const { toast } = useToast()

  const postToTwitter = async (content: string, mediaUrl: string | null) => {
    try {
      console.log('Attempting to post to Twitter with:', { content, mediaUrl })
      const { data, error } = await supabase.functions.invoke('twitter', {
        body: { 
          content,
          mediaUrl
        }
      })
      
      if (error) {
        console.error('Error from Twitter edge function:', error)
        throw error
      }
      
      console.log('Twitter API response:', data)
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

  const savePost = async (
    data: PostForm, 
    selectedPlatforms: string[], 
    date: Date | undefined,
    mediaPreview: string | null
  ) => {
    console.log('Saving post to database:', { data, selectedPlatforms, date, mediaPreview })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: "Authentication error",
        description: "Please sign in to post.",
        variant: "destructive",
      })
      return false
    }

    const { error } = await supabase
      .from('posts')
      .insert({
        title: data.title,
        content: data.content,
        post_type: data.postType,
        platforms: selectedPlatforms,
        scheduled_date: date?.toISOString(),
        media_url: mediaPreview,
        status: data.postType === 'schedule' ? 'scheduled' : 'published',
        user_id: user.id
      })

    if (error) {
      console.error('Error saving post:', error)
      toast({
        title: "Error saving post",
        description: "Your post couldn't be saved. Please try again.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (
    data: PostForm,
    selectedPlatforms: string[],
    date: Date | undefined,
    mediaPreview: string | null
  ) => {
    console.log('Starting post submission:', { data, selectedPlatforms, date, mediaPreview })
    let success = true

    if (selectedPlatforms.includes('twitter')) {
      success = await postToTwitter(data.content, mediaPreview)
    }

    if (success) {
      success = await savePost(data, selectedPlatforms, date, mediaPreview)
      
      if (success) {
        toast({
          title: "Success!",
          description: data.postType === "now" 
            ? "Your post has been published" 
            : `Your post has been scheduled for ${date!.toLocaleDateString()}`,
        })
      }
    }

    return success
  }

  return {
    handleSubmit
  }
}