import { UseFormReturn } from "react-hook-form"
import { PostForm } from "@/types/post"
import { Button } from "@/components/ui/button"
import { PlatformPreviewTabs } from "./previews/PlatformPreviewTabs"

interface PreviewStepProps {
  form: UseFormReturn<PostForm>
  selectedPlatforms: string[]
  mediaPreview: string | null
  date?: Date
  onBack: () => void
  onSubmit: (data: PostForm) => void
}

export const PreviewStep = ({
  form,
  selectedPlatforms,
  mediaPreview,
  date,
  onBack,
  onSubmit,
}: PreviewStepProps) => {
  return (
    <div className="space-y-6">
      <PlatformPreviewTabs
        selectedPlatforms={selectedPlatforms}
        data={{
          ...form.getValues(),
          scheduledDate: date
        }}
        mediaPreview={mediaPreview}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          type="button"
          onClick={() => onSubmit(form.getValues())}
          className="bg-[#E86643] hover:bg-[#E86643]/90"
        >
          {form.watch("postType") === "schedule" ? "Schedule Post" : "Post Now"}
        </Button>
      </div>
    </div>
  )
}