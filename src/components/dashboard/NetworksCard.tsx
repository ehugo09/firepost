import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Facebook, Twitter, Instagram, Linkedin, Users, BarChart3, MessageSquare, Plus } from "lucide-react";
import { toast } from "sonner";

interface NetworksCardProps {
  networks: Array<{ name: string; icon: string; lessons: number; hours: number }>;
}

const NetworksCard = ({ networks }: NetworksCardProps) => {
  const socialStats = [
    {
      icon: <Users className="w-4 h-4 text-purple-500" />,
      label: "Total Followers",
      value: "12.5K",
      change: "+2.4%",
      changeColor: "text-green-500"
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
      label: "Engagement Rate",
      value: "4.8%",
      change: "+0.8%",
      changeColor: "text-green-500"
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-orange-500" />,
      label: "Messages",
      value: "48",
      change: "12 new",
      changeColor: "text-blue-500"
    }
  ];

  const socialNetworks = [
    { name: "Instagram", icon: <Instagram className="w-4 h-4" />, status: "disconnected" },
    { name: "Twitter", icon: <Twitter className="w-4 h-4" />, status: "disconnected" },
    { name: "Facebook", icon: <Facebook className="w-4 h-4" />, status: "disconnected" },
    { name: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, status: "disconnected" }
  ];

  const handleConnect = (networkName: string) => {
    console.log(`Connecting to ${networkName}...`);
    if (networkName === "Twitter") {
      // Handle Twitter connection
      toast.info("Connecting to Twitter...");
    } else {
      toast.info(`${networkName} integration coming soon!`);
    }
  };

  return (
    <Card className="p-2 h-full bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">Social Networks</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">0 Active</span>
      </div>

      {/* Social Networks Section */}
      <div className="space-y-2 mb-4">
        {socialNetworks.map((network, index) => (
          <div key={index} className="p-2 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {network.icon}
                <span className="text-sm font-medium">{network.name}</span>
              </div>
              {network.status === "connected" ? (
                <span className="text-green-500">●</span>
              ) : (
                <button 
                  onClick={() => handleConnect(network.name)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="space-y-3">
        {socialStats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stat.icon}
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className="text-sm font-semibold">{stat.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <Progress value={75} className="h-1" />
              <span className={`text-xs ${stat.changeColor} ml-2`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NetworksCard;