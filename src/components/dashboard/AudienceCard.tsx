import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

const AudienceCard = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-500" />
          <h2 className="text-sm font-semibold">Audience</h2>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold">12.5K</div>
        <div className="text-xs text-gray-500">Total followers</div>
        <div className="text-xs text-green-500">+2.4% this week</div>
      </div>
    </Card>
  );
};

export default AudienceCard;