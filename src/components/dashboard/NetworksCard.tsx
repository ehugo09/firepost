import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Facebook, Twitter, Instagram, Linkedin, Users, BarChart3, MessageSquare, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface NetworksCardProps {
  networks: Array<{ name: string; icon: string; lessons: number; hours: number }>;
}

interface SocialConnection {
  id: string;
  platform: string;
  username: string | null;
  profile_picture: string | null;
}

const NetworksCard = ({ networks }: NetworksCardProps) => {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No active session");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('social_connections')
        .select('*');

      if (error) throw error;

      console.log("Fetched connections:", data);
      setConnections(data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load social connections");
    } finally {
      setLoading(false);
    }
  };

  const openTwitterPopup = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('twitter', {
        body: { action: 'connect' }
      });

      if (error) throw error;
      
      if (data.url) {
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open(
          data.url,
          'Twitter Auth',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // Poll for popup close and refresh connections
        const checkPopup = setInterval(() => {
          if (!popup || popup.closed) {
            clearInterval(checkPopup);
            fetchConnections(); // Refresh the connections list
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect to Twitter");
    }
  };

  const handleConnect = async (networkName: string, platform: string) => {
    console.log(`Connecting to ${networkName}...`);
    toast.info(`Connecting to ${networkName}...`);
    
    try {
      if (platform === "twitter") {
        await openTwitterPopup();
      } else {
        toast.info(`${networkName} integration coming soon!`);
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error(`Failed to connect to ${networkName}`);
    }
  };

  const isConnected = (platform: string) => {
    return connections.some(conn => conn.platform === platform);
  };

  const activeConnections = connections.length;

  if (loading) {
    return (
      <Card className="p-2 h-full bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const socialNetworks = [
    { name: "Twitter", icon: <Twitter className="w-4 h-4" />, platform: "twitter" },
    { name: "Instagram", icon: <Instagram className="w-4 h-4" />, platform: "instagram" },
    { name: "Facebook", icon: <Facebook className="w-4 h-4" />, platform: "facebook" },
    { name: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, platform: "linkedin" }
  ];

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

  return (
    <Card className="p-2 h-full bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">Social Networks</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          {activeConnections} Active
        </span>
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
              {isConnected(network.platform) ? (
                <span className="text-green-500">●</span>
              ) : (
                <button 
                  onClick={() => handleConnect(network.name, network.platform)}
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