import { Card } from "@/components/ui/card";
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import SocialNetworkItem from "./networks/SocialNetworkItem";
import NetworkStats from "./networks/NetworkStats";
import { openTwitterPopup } from "./networks/TwitterConnection";

interface SocialConnection {
  id: string;
  platform: string;
  username: string | null;
  profile_picture: string | null;
}

const NetworksCard = () => {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      console.log("Fetching social connections...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No active session found when fetching connections");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('social_connections')
        .select('*');

      if (error) throw error;

      console.log("Successfully fetched connections:", data);
      setConnections(data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load social connections");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (networkName: string, platform: string) => {
    console.log(`Starting connection process for ${networkName}...`);
    toast.info(`Connecting to ${networkName}...`);
    
    try {
      if (platform === "twitter") {
        console.log("Initiating Twitter connection...");
        const result = await openTwitterPopup();
        console.log("Twitter connection result:", result);
        // Refresh connections after successful connection
        await fetchConnections();
      } else {
        console.log(`${networkName} integration not implemented yet`);
        toast.info(`${networkName} integration coming soon!`);
      }
    } catch (error) {
      console.error(`Connection error for ${networkName}:`, error);
      toast.error(`Failed to connect to ${networkName}`);
    }
  };

  const isConnected = (platform: string) => {
    return connections.some(conn => conn.platform === platform);
  };

  const socialNetworks = [
    { icon: <Twitter className="w-4 h-4" />, name: "Twitter", platform: "twitter" },
    { icon: <Instagram className="w-4 h-4" />, name: "Instagram", platform: "instagram" },
    { icon: <Facebook className="w-4 h-4" />, name: "Facebook", platform: "facebook" },
    { icon: <Linkedin className="w-4 h-4" />, name: "LinkedIn", platform: "linkedin" }
  ];

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

  const activeConnections = connections.length;

  return (
    <Card className="p-2 h-full bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">Social Networks</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          {activeConnections} Active
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {socialNetworks.map((network, index) => (
          <SocialNetworkItem
            key={index}
            {...network}
            isConnected={isConnected(network.platform)}
            onConnect={handleConnect}
          />
        ))}
      </div>

      <NetworkStats />
    </Card>
  );
};

export default NetworksCard;