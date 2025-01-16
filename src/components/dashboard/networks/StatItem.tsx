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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>
      <div className="flex justify-between items-center">
        <Progress value={75} className="h-1 bg-gray-700" />
        <span className={`text-xs ${changeColor} ml-2`}>{change}</span>
      </div>
    </div>
  );
};

export default StatItem;