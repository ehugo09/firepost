import { Card } from "@/components/ui/card";
import { ArrowUp, Users, MessageSquare, Share2 } from "lucide-react";

const QuickAnalytics = () => {
  const stats = [
    {
      title: "Total Followers",
      value: "2,543",
      change: "+12%",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Engagement",
      value: "8.2%",
      change: "+3%",
      icon: <Share2 className="w-4 h-4" />,
    },
    {
      title: "Messages",
      value: "147",
      change: "+28%",
      icon: <MessageSquare className="w-4 h-4" />,
    }
  ];

  return (
    <Card className="p-4 h-full bg-white dark:bg-[#151B2E]/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
      <h2 className="text-sm font-semibold mb-4 text-gray-800 dark:text-white">Quick Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="p-3 rounded-lg bg-gray-50 dark:bg-[#1A2235]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.title}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuickAnalytics;