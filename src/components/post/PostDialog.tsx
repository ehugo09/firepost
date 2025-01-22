import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { PostDialogHeader } from "./PostDialogHeader"
import { PostContentStep } from "./PostContentStep"
import { PostScheduleStep } from "./PostScheduleStep"
import { usePostForm } from "./hooks/usePostForm"

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
      modal
    >
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <PostDialogHeader 
          step={step} 
          onBack={handleBack}
        />

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
              />
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}