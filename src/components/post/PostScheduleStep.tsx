import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { PostForm } from "@/types/post"
import { PostScheduler } from "./PostScheduler"

interface PostScheduleStepProps {
  form: UseFormReturn<PostForm>
  date: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  onContinue: () => void
}

export const PostScheduleStep = ({
  form,
  date,
  onDateSelect,
  onContinue,
}: PostScheduleStepProps) => {
  return (
    <>
      <PostScheduler 
        form={form}
        date={date}
        onDateSelect={onDateSelect}
      />

      <div className="flex justify-end">
        <Button 
          type="button"
          onClick={onContinue}
          className="bg-[#E86643] hover:bg-[#E86643]/90"
          disabled={form.watch("postType") === "schedule" && !date}
        >
          Continue
        </Button>
      </div>
    </>
  )
}