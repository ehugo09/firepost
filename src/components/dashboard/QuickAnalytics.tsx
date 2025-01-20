import { Card } from "@/components/ui/card";
import { Users, Share2 } from "lucide-react";
import AnalyticCard from "./analytics/AnalyticCard";

const QuickAnalytics = () => {
  const followersData = [
    { name: 'Mon', value: 2100 },
    { name: 'Tue', value: 2300 },
    { name: 'Wed', value: 2500 },
    { name: 'Thu', value: 2400 },
    { name: 'Fri', value: 2600 },
    { name: 'Sat', value: 2800 },
    { name: 'Sun', value: 3000 },
  ];

  const engagementData = [
    { name: 'Mon', value: 5.2 },
    { name: 'Tue', value: 5.8 },
    { name: 'Wed', value: 6.5 },
    { name: 'Thu', value: 6.2 },
    { name: 'Fri', value: 7.0 },
    { name: 'Sat', value: 7.5 },
    { name: 'Sun', value: 8.2 },
  ];

  return (
    <Card className="p-4 h-[280px] bg-white dark:bg-[#151B2E]/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
      <h2 className="text-sm font-semibold mb-4 text-gray-800 dark:text-white">Quick Analytics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <AnalyticCard 
          icon={<Users className="w-4 h-4" />}
          percentage="+12%"
          value="2,543"
          label="Total Followers"
          data={followersData}
        />
        
        <AnalyticCard 
          icon={<Share2 className="w-4 h-4" />}
          percentage="+3%"
          value="8.2%"
          label="Engagement"
          data={engagementData}
        />
      </div>
    </Card>
  );
};

export default QuickAnalytics;