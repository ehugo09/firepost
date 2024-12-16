import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface EngagementChartProps {
  chartData: Array<{ name: string; value: number }>;
}

const EngagementChart = ({ chartData }: EngagementChartProps) => {
  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-semibold">Engagement Rate</h2>
        </div>
        <select className="text-xs border rounded px-2 py-1">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      <div className="h-[120px] flex items-end justify-between gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="w-full">
            <div 
              className="bg-indigo-100 rounded-sm" 
              style={{ height: `${item.value}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {chartData.map((item, index) => (
          <span key={index}>{item.name}</span>
        ))}
      </div>
    </Card>
  );
};

export default EngagementChart;