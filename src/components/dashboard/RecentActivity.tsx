import { Card } from "@/components/ui/card";

const RecentActivity = () => {
  return (
    <Card className="p-4 md:col-span-2">
      <h2 className="text-sm font-semibold mb-3">Recent Activity</h2>
      <div className="space-y-2">
        {[
          { network: 'Twitter', action: 'New follower', time: '2m ago' },
          { network: 'Instagram', action: 'Post liked', time: '5m ago' },
          { network: 'LinkedIn', action: 'Message received', time: '15m ago' },
          { network: 'Facebook', action: 'Comment on post', time: '1h ago' },
        ].map((activity, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">{activity.network}</span>
              <span className="text-gray-500">{activity.action}</span>
            </div>
            <span className="text-xs text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;