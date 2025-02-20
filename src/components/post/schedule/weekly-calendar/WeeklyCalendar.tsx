import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { DayCell } from "./DayCell";
import { ScheduledPostsList } from "./ScheduledPostsList";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeeklyCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const WeeklyCalendar = ({ selectedDate, onDateSelect }: WeeklyCalendarProps) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { locale: fr }));

  // Initialize with current date if no date is selected
  const today = new Date();
  if (!selectedDate) {
    onDateSelect(today);
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const navigateWeek = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.preventDefault(); // Prevent form submission
    setCurrentWeekStart(prev => 
      addDays(prev, direction === 'prev' ? -7 : 7)
    );
  };

  const displayDate = hoveredDate || selectedDate || today;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => navigateWeek(e, 'prev')}
          type="button" // Explicitly set type to button
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {format(currentWeekStart, 'MMMM yyyy', { locale: fr })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => navigateWeek(e, 'next')}
          type="button" // Explicitly set type to button
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            isSelected={selectedDate?.toDateString() === date.toDateString()}
            onSelect={onDateSelect}
            onHover={setHoveredDate}
          />
        ))}
      </div>

      <ScheduledPostsList date={displayDate} />
    </div>
  );
};