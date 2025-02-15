import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, Coffee } from "lucide-react";

interface ProgressStatsProps {
  data: Array<{ label: string; value: number; color: string }>;
}

const ProgressStats = ({ data }: ProgressStatsProps) => {
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);
  const percentages = data.map(item => ({
    ...item,
    percentage: Math.round((item.value / totalValue) * 100)
  }));

  const icons = {
    'In progress': Clock,
    'Completed': CheckCircle,
    'Upcoming': Coffee
  };

  return (
    <Card className="p-4 bg-white h-full">
      <h2 className="text-xl font-semibold mb-4">Progress statistics</h2>
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-semibold">64</span>
          <span className="text-lg text-gray-500">%</span>
        </div>
        <p className="text-sm text-gray-500">Total activity</p>
      </div>

      <div className="flex gap-1 mb-3">
        {percentages.map((item, index) => (
          <div
            key={index}
            className="h-1 rounded-full flex-1"
            style={{ backgroundColor: item.color }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {data.map((item, index) => {
          const Icon = icons[item.label as keyof typeof icons];
          return (
            <div key={index} className="bg-gray-50 p-2 rounded-lg text-center">
              <div 
                className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center"
                style={{ backgroundColor: item.color }}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-semibold">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProgressStats;