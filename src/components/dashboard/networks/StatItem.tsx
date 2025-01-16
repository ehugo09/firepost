import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface StatItemProps {
  icon: React.ReactElement<LucideIcon>;
  label: string;
  value: string;
  change: string;
  changeColor: string;
}

const StatItem = ({ icon, label, value, change, changeColor }: StatItemProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <span className="text-base font-medium text-white tracking-wide">{value}</span>
      </div>
      <div className="flex justify-between items-center gap-3">
        <Progress value={75} className="h-1 bg-gray-700/50" />
        <span className={`text-xs ${changeColor} ml-2 whitespace-nowrap`}>{change}</span>
      </div>
    </div>
  );
};

export default StatItem;