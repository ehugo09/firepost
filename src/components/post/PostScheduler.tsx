import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { PostForm } from "@/types/post";
import { PostTypeSelector } from "./schedule/PostTypeSelector";
import { WeeklyCalendar } from "./schedule/weekly-calendar/WeeklyCalendar";
import { ScheduledPostsList } from "./schedule/weekly-calendar/ScheduledPostsList";

const mockScheduledPosts = [
  {
    date: new Date(2024, 3, 15, 10, 30),
    title: "Product Launch Announcement",
    platforms: ["twitter", "instagram"]
  },
  {
    date: new Date(2024, 3, 16, 14, 0),
    title: "Customer Success Story",
    platforms: ["linkedin"]
  }
];

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
          <div className="flex flex-col gap-4">
            <WeeklyCalendar 
              selectedDate={date}
              onDateSelect={onDateSelect}
            />
            <ScheduledPostsList posts={mockScheduledPosts} />
          </div>
        </div>
      )}
    </div>
  );
};