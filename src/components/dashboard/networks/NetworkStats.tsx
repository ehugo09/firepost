import { Users, BarChart3, MessageSquare } from "lucide-react";
import StatItem from "./StatItem";

const NetworkStats = () => {
  const stats = [
    {
      icon: <Users className="w-4 h-4 text-purple-500" />,
      label: "Total Followers",
      value: "12.5K",
      change: "+2.4%",
      changeColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
      label: "Engagement Rate",
      value: "4.8%",
      change: "+0.8%",
      changeColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-orange-500" />,
      label: "Messages",
      value: "48",
      change: "12 new",
      changeColor: "text-blue-600 dark:text-blue-400"
    }
  ];

  return (
    <div className="space-y-4 mt-4">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
};

export default NetworkStats;