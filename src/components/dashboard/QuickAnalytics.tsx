import { Card } from "@/components/ui/card";
import { ArrowUp, Users, MessageSquare, Share2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";

const QuickAnalytics = () => {
  // Sample data for the charts
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

  const messagesData = [
    { name: '12AM', value: 10 },
    { name: '4AM', value: 5 },
    { name: '8AM', value: 25 },
    { name: '12PM', value: 45 },
    { name: '4PM', value: 65 },
    { name: '8PM', value: 40 },
    { name: '11PM', value: 30 },
  ];

  return (
    <Card className="p-4 h-full bg-white dark:bg-[#151B2E]/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
      <h2 className="text-sm font-semibold mb-4 text-gray-800 dark:text-white">Quick Analytics</h2>
      
      {/* Top row with two charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Followers Chart */}
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1A2235]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-1" />
              +12%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            2,543
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Total Followers
          </p>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followersData}>
                <defs>
                  <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E86643" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E86643" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#E86643" 
                  fillOpacity={1} 
                  fill="url(#colorFollowers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1A2235]">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-1" />
              +3%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            8.2%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Engagement
          </p>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E86643" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E86643" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#E86643" 
                  fillOpacity={1} 
                  fill="url(#colorEngagement)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row with messages chart */}
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1A2235]">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-green-600 flex items-center">
            <ArrowUp className="w-3 h-3 mr-1" />
            +28%
          </span>
        </div>
        <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          147
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Messages
        </p>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={messagesData}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E86643" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E86643" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#E86643" 
                fillOpacity={1} 
                fill="url(#colorMessages)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default QuickAnalytics;