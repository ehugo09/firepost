import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { PostContentStep } from "./PostContentStep"
import { PostScheduleStep } from "./PostScheduleStep"
import { usePostForm } from "./hooks/usePostForm"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PreviewPanel } from "./PreviewPanel"

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
        className="max-w-[95vw] w-[1200px] h-[90vh] overflow-y-auto grid grid-cols-2 gap-6 p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="p-6 h-full">
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
                <h2 className="text-2xl font-semibold">Create Post</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Step {step} of 2: {step === 1 ? "Content" : "Schedule"}
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {step === 1 ? (
                <PostContentStep
                  form={form}
                  selectedPlatforms={selectedPlatforms}
                  onPlatformToggle={togglePlatform}
                  mediaPreview={mediaPreview}
                  onFileChange={handleFileChange}
                  onRemoveMedia={removeMedia}
                  onContinue={handleContinue}
                />
              ) : (
                <PostScheduleStep
                  form={form}
                  date={date}
                  onDateSelect={setDate}
                  onContinue={handleSubmit}
                />
              )}
            </form>
          </Form>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900">
          <PreviewPanel
            form={form}
            selectedPlatforms={selectedPlatforms}
            mediaPreview={mediaPreview}
            date={date}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}