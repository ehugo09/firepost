import { Card } from "@/components/ui/card";
import { Twitter, Instagram, Linkedin, UserPlus, MessageCircle } from "lucide-react";

const LatestActivityContainer = () => {
  const activities = [
    {
      type: "follower",
      network: "Twitter",
      content: "New follower: John Doe",
      time: "2m ago",
      icon: <UserPlus className="w-4 h-4" />,
      networkIcon: <Twitter className="w-4 h-4" />
    },
    {
      type: "message",
      network: "Instagram",
      content: "Message: Hey, love your content!",
      time: "5m ago",
      icon: <MessageCircle className="w-4 h-4" />,
      networkIcon: <Instagram className="w-4 h-4" />
    },
    {
      type: "follower",
      network: "LinkedIn",
      content: "New follower: Jane Smith",
      time: "10m ago",
      icon: <UserPlus className="w-4 h-4" />,
      networkIcon: <Linkedin className="w-4 h-4" />
    }
  ];

  return (
    <Card className="p-4 h-full bg-white">
      <h2 className="text-sm font-semibold mb-4">Latest Activity</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{activity.content}</span>
                <div className="text-primary">{activity.networkIcon}</div>
              </div>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LatestActivityContainer;