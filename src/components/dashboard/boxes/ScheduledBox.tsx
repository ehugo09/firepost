import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const ScheduledBox = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Scheduled Posts</CardTitle>
        <Clock className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">12</div>
        <p className="text-sm text-gray-500 mt-2">Posts scheduled for this week</p>
      </CardContent>
    </Card>
  );
};

export default ScheduledBox;