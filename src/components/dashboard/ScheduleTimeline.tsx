import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Clock, Twitter, Instagram, Linkedin } from "lucide-react";

const ScheduleTimeline = () => {
  const posts = [
    {
      time: "10:00 AM",
      title: "Product Launch Announcement",
      content: "Excited to announce our latest feature release! Check out the new analytics dashboard...",
      platform: "Twitter",
      status: "scheduled",
      icon: <Twitter className="w-4 h-4" />,
      color: "text-[#1DA1F2]"
    },
    {
      time: "2:00 PM",
      title: "Customer Success Story",
      content: "See how Company X achieved 200% growth using our platform...",
      platform: "LinkedIn",
      status: "scheduled",
      icon: <Linkedin className="w-4 h-4" />,
      color: "text-[#0A66C2]"
    },
    {
      time: "4:30 PM",
      title: "Behind the Scenes",
      content: "Take a look at our team working on the next big update...",
      platform: "Instagram",
      status: "draft",
      icon: <Instagram className="w-4 h-4" />,
      color: "text-[#E4405F]"
    }
  ];

  return (
    <Card className="p-4 h-[500px] bg-white dark:bg-[#151B2E]/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Today's Schedule</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 posts scheduled for today</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg border hover:bg-gray-50 dark:hover:bg-[#1A2235] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg border hover:bg-gray-50 dark:hover:bg-[#1A2235] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-gray-50 dark:bg-[#1A2235] hover:bg-gray-100 dark:hover:bg-[#1E2943] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{post.time}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                </div>
                <div className={`${post.color}`}>
                  {post.icon}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                  {post.status}
                </span>
                <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ScheduleTimeline;