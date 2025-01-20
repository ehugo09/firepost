import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";

interface ScheduleCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const ScheduleCalendar = ({ date, onDateSelect }: ScheduleCalendarProps) => {
  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={onDateSelect}
        initialFocus
        className="rounded-md border"
      />
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="w-[120px] justify-start text-left font-normal"
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>Set time</span>
        </Button>
      </div>
    </div>
  );
};