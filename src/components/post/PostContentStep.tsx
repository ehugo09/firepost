import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { PostForm } from "@/types/post"
import { PlatformSelector } from "./PlatformSelector"
import { MediaUpload } from "./MediaUpload"

interface PostContentStepProps {
  form: UseFormReturn<PostForm>
  selectedPlatforms: string[]
  onPlatformToggle: (platform: string) => void
  mediaPreview: string | null
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveMedia: () => void
  onContinue: () => void
}

export const PostContentStep = ({
  form,
  selectedPlatforms,
  onPlatformToggle,
  mediaPreview,
  onFileChange,
  onRemoveMedia,
  onContinue,
}: PostContentStepProps) => {
  return (
    <>
      <PlatformSelector 
        selectedPlatforms={selectedPlatforms}
        onPlatformToggle={onPlatformToggle}
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
        onFileChange={onFileChange}
        onRemoveMedia={onRemoveMedia}
      />

      <div className="flex justify-end">
        <Button 
          type="button"
          onClick={onContinue}
          className="bg-[#E86643] hover:bg-[#E86643]/90"
        >
          Continue
        </Button>
      </div>
    </>
  )
}