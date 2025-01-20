import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PostDialogHeaderProps {
  step: number
  onBack?: () => void
}

export const PostDialogHeader = ({ step, onBack }: PostDialogHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-2">
        {step === 2 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-semibold">Create Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Step {step} of 2: {step === 1 ? "Content" : "Schedule"}
          </p>
        </div>
      </div>
    </div>
  )
}