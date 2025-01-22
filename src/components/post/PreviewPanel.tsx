import { UseFormReturn, useWatch } from "react-hook-form"
import { PostForm } from "@/types/post"
import { PlatformPreviewTabs } from "./previews/PlatformPreviewTabs"

interface PreviewPanelProps {
  form: UseFormReturn<PostForm>
  selectedPlatforms: string[]
  mediaPreview: string | null
  date?: Date
}

export function PreviewPanel({
  form,
  selectedPlatforms,
  mediaPreview,
  date,
}: PreviewPanelProps) {
  const formValues = useWatch({
    control: form.control,
    defaultValue: form.getValues()
  }) as PostForm

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Preview</h3>
      <PlatformPreviewTabs
        selectedPlatforms={selectedPlatforms}
        data={{
          ...formValues,
          scheduledDate: date
        }}
        mediaPreview={mediaPreview}
      />
    </div>
  )
}