import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageSquare } from "lucide-react";

const MessagesCard = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold">Messages</h2>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">12 New</span>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold">48</div>
        <div className="text-xs text-gray-500">Total unread messages</div>
        <Progress value={75} className="h-1" />
      </div>
    </Card>
  );
};

export default MessagesCard;