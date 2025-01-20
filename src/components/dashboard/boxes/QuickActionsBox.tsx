import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Send, Clock, Download } from "lucide-react";

const QuickActionsBox = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Send className="h-6 w-6 mb-2" />
            <span className="text-sm">Post</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Clock className="h-6 w-6 mb-2" />
            <span className="text-sm">Schedule</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
            <Download className="h-6 w-6 mb-2" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsBox;