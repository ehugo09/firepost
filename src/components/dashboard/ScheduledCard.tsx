import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

const ScheduledCard = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <h2 className="text-sm font-semibold">Scheduled</h2>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold">8</div>
        <div className="text-xs text-gray-500">Pending posts</div>
        <div className="text-xs text-orange-500">Next in 2 hours</div>
      </div>
    </Card>
  );
};

export default ScheduledCard;