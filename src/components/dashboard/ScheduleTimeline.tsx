import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ScheduleTimeline = () => {
  return (
    <Card className="p-4 md:col-span-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold">Today's Schedule</h2>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-lg border"><ChevronLeft className="w-3 h-3" /></button>
          <button className="p-1 rounded-lg border"><ChevronRight className="w-3 h-3" /></button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            time: "10:00 AM",
            title: "Tweet about product update",
            platform: "Twitter",
            status: "pending"
          },
          {
            time: "2:00 PM",
            title: "Share customer success story",
            platform: "LinkedIn",
            status: "pending"
          },
          {
            time: "4:30 PM",
            title: "Post weekly highlights",
            platform: "Instagram",
            status: "pending"
          }
        ].map((post, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border bg-gray-50"
          >
            <div className="text-xs text-gray-500">{post.time}</div>
            <div className="font-medium text-sm mt-1">{post.title}</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">{post.platform}</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                {post.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ScheduleTimeline;