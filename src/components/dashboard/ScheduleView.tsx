import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const ScheduleView = () => {
  const scheduledPosts = [
    {
      time: "10:30 AM",
      content: "Introducing our latest product features! 🚀",
      networks: ["instagram", "twitter"],
      status: "scheduled"
    },
    {
      time: "2:00 PM",
      content: "Join our webinar on social media strategy",
      networks: ["linkedin", "facebook"],
      status: "draft",
      current: true
    },
    {
      time: "4:30 PM",
      content: "Customer spotlight: How Company X achieved 300% growth",
      networks: ["linkedin", "twitter", "instagram"],
      status: "scheduled"
    }
  ];

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case "twitter":
        return <Twitter className="w-4 h-4 text-blue-400" />;
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-blue-700" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Scheduled Posts</h2>
        <div className="flex gap-2">
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="py-1.5 px-3">Today</span>
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scheduledPosts.map((post, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl ${
              post.current ? 'bg-[#8B5CF6] text-white' : 'bg-gray-50'
            }`}
          >
            <div className="text-sm mb-2">{post.time}</div>
            <p className="text-sm font-medium mb-3 line-clamp-2">{post.content}</p>
            
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-1.5">
                {post.networks.map((network, idx) => (
                  <span key={idx} className={`${post.current ? 'text-white' : ''}`}>
                    {getNetworkIcon(network)}
                  </span>
                ))}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                post.current 
                  ? 'bg-white/20' 
                  : post.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-green-100 text-green-700'
              }`}>
                {post.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ScheduleView;