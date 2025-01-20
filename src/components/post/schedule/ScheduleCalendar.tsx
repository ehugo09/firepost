import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import { addDays, startOfWeek } from "date-fns";

interface ScheduleCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const ScheduleCalendar = ({ date, onDateSelect }: ScheduleCalendarProps) => {
  // Get the start of the current week (Sunday)
  const currentWeekStart = startOfWeek(new Date());
  // Create an array of dates for the current week
  const currentWeek = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={onDateSelect}
        initialFocus
        className="w-full rounded-md border"
        classNames={{
          months: "w-full",
          month: "w-full",
          table: "w-full",
          row: "flex w-full justify-between",
          cell: "h-24 w-full relative", // Increased height for better visibility
          day: "h-full w-full p-0 font-normal hover:bg-accent/20 rounded-md relative",
          day_selected: "bg-[#E86643] text-white hover:bg-[#E86643]/90",
          day_today: "bg-accent text-accent-foreground",
        }}
        // Only show current week
        fromDate={currentWeekStart}
        toDate={addDays(currentWeekStart, 6)}
        // Disable dates before today
        disabled={(date) => date < new Date()}
        components={{
          DayContent: ({ date }) => (
            <div className="h-full w-full p-2 flex flex-col">
              <span className="text-sm">{date.getDate()}</span>
              {/* Example scheduled post indicator - will be replaced with real data */}
              <div className="mt-auto flex flex-wrap gap-1">
                <div 
                  className="w-2 h-2 rounded-full bg-[#E86643]" 
                  title="Scheduled post"
                />
              </div>
            </div>
          ),
        }}
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