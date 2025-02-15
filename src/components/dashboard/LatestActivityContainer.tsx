import { Card } from "@/components/ui/card";
import { Twitter, Instagram, Linkedin, UserPlus, MessageCircle } from "lucide-react";

const LatestActivityContainer = () => {
  const activities = [
    {
      type: "follower",
      network: "Twitter",
      content: "New follower: John Doe",
      time: "2m ago",
      icon: <UserPlus className="w-4 h-4 text-white" />,
      networkIcon: <Twitter className="w-4 h-4" />,
      networkColor: "text-[#1DA1F2]",
      typeColor: "text-primary",
      bgColor: "bg-primary"
    },
    {
      type: "message",
      network: "Instagram",
      content: "Message: Hey, love your content!",
      time: "5m ago",
      icon: <MessageCircle className="w-4 h-4 text-white" />,
      networkIcon: <Instagram className="w-4 h-4" />,
      networkColor: "text-[#E4405F]",
      typeColor: "text-[#0EA5E9]",
      bgColor: "bg-[#0EA5E9]"
    },
    {
      type: "follower",
      network: "LinkedIn",
      content: "New follower: Jane Smith",
      time: "10m ago",
      icon: <UserPlus className="w-4 h-4 text-white" />,
      networkIcon: <Linkedin className="w-4 h-4" />,
      networkColor: "text-[#0A66C2]",
      typeColor: "text-primary",
      bgColor: "bg-primary"
    }
  ];

  return (
    <Card className="p-4 h-full bg-white dark:bg-[#151B2E]/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
      <h2 className="text-sm font-semibold mb-4 text-gray-800 dark:text-white">Latest Activity</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-[#1A2235]">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activity.bgColor}`}>
              <div className={activity.typeColor}>{activity.icon}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{activity.content}</span>
                <div className={activity.networkColor}>{activity.networkIcon}</div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LatestActivityContainer;