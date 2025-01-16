import { Progress } from "@/components/ui/progress";

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeColor: string;
}

const StatItem = ({ icon, label, value, change, changeColor }: StatItemProps) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
        <span className="text-base font-medium text-white tracking-wider">{value}</span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <Progress value={75} className="h-1 bg-gray-700/40" />
        <span className={`text-xs ${changeColor} ml-2 whitespace-nowrap font-medium`}>{change}</span>
      </div>
    </div>
  );
};

export default StatItem;