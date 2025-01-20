import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

const MessagesBox = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Unread Messages</CardTitle>
        <Inbox className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">28</div>
        <p className="text-sm text-gray-500 mt-2">Across all platforms</p>
      </CardContent>
    </Card>
  );
};

export default MessagesBox;