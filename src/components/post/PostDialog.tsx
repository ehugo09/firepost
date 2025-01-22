import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { PostContentStep } from "./PostContentStep"
import { PostScheduleStep } from "./PostScheduleStep"
import { PreviewStep } from "./PreviewStep"
import { usePostForm } from "./hooks/usePostForm"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDialog({ open, onOpenChange }: PostDialogProps) {
  const {
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
  } = usePostForm(() => onOpenChange(false))

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleClose}
    >
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            {step > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle className="text-2xl font-semibold">Create Post</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Step {step} of 3: {
                  step === 1 ? "Content" : 
                  step === 2 ? "Schedule" : 
                  "Preview"
                }
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {step === 1 && (
              <PostContentStep
                form={form}
                selectedPlatforms={selectedPlatforms}
                onPlatformToggle={togglePlatform}
                mediaPreview={mediaPreview}
                onFileChange={handleFileChange}
                onRemoveMedia={removeMedia}
                onContinue={handleContinue}
              />
            )}
            {step === 2 && (
              <PostScheduleStep
                form={form}
                date={date}
                onDateSelect={setDate}
                onContinue={handleContinue}
              />
            )}
            {step === 3 && (
              <PreviewStep
                form={form}
                selectedPlatforms={selectedPlatforms}
                mediaPreview={mediaPreview}
                date={date}
                onBack={handleBack}
                onSubmit={handleSubmit}
              />
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}