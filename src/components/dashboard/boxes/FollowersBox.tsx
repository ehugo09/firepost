import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const FollowersBox = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Total Followers</CardTitle>
        <Users className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">24.5K</div>
        <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
      </CardContent>
    </Card>
  );
};

export default FollowersBox;