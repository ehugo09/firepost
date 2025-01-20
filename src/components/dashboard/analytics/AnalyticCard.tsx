import { ArrowUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AnalyticCardProps {
  icon: React.ReactNode;
  percentage: string;
  value: string;
  label: string;
  data: Array<{ name: string; value: number }>;
}

const AnalyticCard = ({ icon, percentage, value, label, data }: AnalyticCardProps) => {
  return (
    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1A2235]">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg bg-accent/10">
          {icon}
        </div>
        <span className="text-xs font-medium text-green-600 flex items-center">
          <ArrowUp className="w-3 h-3 mr-1" />
          {percentage}
        </span>
      </div>
      <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      <div className="h-[60px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E86643" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#E86643" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#E86643" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticCard;