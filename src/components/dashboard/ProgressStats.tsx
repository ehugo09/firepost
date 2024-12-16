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
    <Card className="p-6 bg-white h-full">
      <h2 className="text-2xl font-semibold mb-6">Progress statistics</h2>
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-6xl font-semibold">64</span>
          <span className="text-xl text-gray-500">%</span>
        </div>
        <p className="text-gray-500">Total activity</p>
      </div>

      <div className="flex gap-1 mb-4">
        {percentages.map((item, index) => (
          <div
            key={index}
            className="h-1 rounded-full flex-1"
            style={{ backgroundColor: item.color }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {data.map((item, index) => {
          const Icon = icons[item.label as keyof typeof icons];
          return (
            <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
              <div 
                className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: item.color }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-semibold">{item.value}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ProgressStats;