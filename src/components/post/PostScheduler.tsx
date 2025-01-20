import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { PostForm } from "@/types/post";
import { PostTypeSelector } from "./schedule/PostTypeSelector";
import { WeeklyCalendar } from "./schedule/weekly-calendar/WeeklyCalendar";

interface PostSchedulerProps {
  form: UseFormReturn<PostForm>;
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const PostScheduler = ({ form, date, onDateSelect }: PostSchedulerProps) => {
  const isScheduled = form.watch("postType") === "schedule";

  return (
    <div className="space-y-6">
      <PostTypeSelector form={form} />

      {isScheduled && (
        <div className="space-y-4">
          <Label className="text-base">Select Date and Time</Label>
          <WeeklyCalendar 
            selectedDate={date}
            onDateSelect={onDateSelect}
          />
        </div>
      )}
    </div>
  );
};