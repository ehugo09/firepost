import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PostIndicators } from "./PostIndicators";

interface DayCellProps {
  date: Date;
  isSelected: boolean;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
}

export const DayCell = ({ date, isSelected, onSelect, onHover }: DayCellProps) => {
  // Mock data - will be replaced with real data from the database
  const mockPosts = [
    { type: 'video' as const },
    { type: 'image' as const },
    { type: 'text' as const },
    { type: 'video' as const },
    { type: 'text' as const }
  ];

  return (
    <div
      className={`
        p-2 rounded-lg border min-h-[100px] cursor-pointer transition-colors
        ${isSelected 
          ? 'border-[#E86643] bg-[#E86643]/10' 
          : 'border-gray-200 hover:border-[#E86643]/50 dark:border-gray-700'
        }
      `}
      onClick={() => onSelect(date)}
      onMouseEnter={() => onHover(date)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="text-sm font-medium mb-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {format(date, 'EEEE', { locale: fr })}
        </div>
        {format(date, 'd', { locale: fr })}
      </div>
      
      <PostIndicators posts={mockPosts} />
    </div>
  );
};