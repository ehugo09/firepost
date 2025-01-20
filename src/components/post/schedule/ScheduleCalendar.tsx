import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { useState } from "react";

interface ScheduleCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const ScheduleCalendar = ({ date, onDateSelect }: ScheduleCalendarProps) => {
  // State to track the current week
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  // Navigation functions
  const goToPreviousWeek = () => {
    const newWeekStart = subWeeks(currentWeekStart, 1);
    // Don't allow going to past weeks
    if (newWeekStart >= startOfWeek(new Date())) {
      setCurrentWeekStart(newWeekStart);
    }
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousWeek}
            disabled={currentWeekStart <= startOfWeek(new Date())}
            className="h-7 w-7 bg-transparent p-0 hover:bg-accent/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
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
            cell: "h-24 w-full relative",
            day: "h-full w-full p-0 font-normal hover:bg-accent/20 rounded-md relative",
            day_selected: "bg-[#E86643] text-white hover:bg-[#E86643]/90",
            day_today: "bg-accent text-accent-foreground",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] pt-2",
            nav: "hidden", // Hide default navigation
            caption: "hidden", // Hide default caption
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

        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextWeek}
            className="h-7 w-7 bg-transparent p-0 hover:bg-accent/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

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