import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { PostForm } from "@/types/post"
import { PostScheduler } from "./PostScheduler"

interface PostScheduleStepProps {
  form: UseFormReturn<PostForm>
  date: Date | undefined
  onDateSelect: (date: Date | undefined) => void
}

export const PostScheduleStep = ({
  form,
  date,
  onDateSelect,
}: PostScheduleStepProps) => {
  return (
    <>
      <PostScheduler 
        form={form}
        date={date}
        onDateSelect={onDateSelect}
      />

      <div className="flex justify-end gap-3">
        <Button type="submit">
          {form.watch("postType") === "schedule" ? "Schedule Post" : "Post Now"}
        </Button>
      </div>
    </>
  )
}