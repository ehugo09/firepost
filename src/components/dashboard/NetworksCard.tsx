import { Card } from "@/components/ui/card";
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import SocialNetworkItem from "./networks/SocialNetworkItem";
import NetworkStats from "./networks/NetworkStats";

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

        // Store state and verifier
        localStorage.setItem('twitter_oauth_state', data.state);
        localStorage.setItem('twitter_code_verifier', data.codeVerifier);

        if (popup) {
          const checkPopup = setInterval(async () => {
            try {
              // Check if the popup URL contains the code parameter
              if (popup.location.href.includes('code=')) {
                const url = new URL(popup.location.href);
                const code = url.searchParams.get('code');
                const state = url.searchParams.get('state');
                
                // Verify state matches
                const storedState = localStorage.getItem('twitter_oauth_state');
                if (state !== storedState) {
                  throw new Error('Invalid state parameter');
                }

                // Exchange code for token
                const { data: callbackData, error: callbackError } = await supabase.functions.invoke('twitter', {
                  body: { 
                    action: 'callback',
                    code,
                    state: localStorage.getItem('twitter_code_verifier')
                  }
                });

                if (callbackError) throw callbackError;

                console.log("Twitter connection successful:", callbackData);
                toast.success("Successfully connected to Twitter!");
                
                // Clean up
                localStorage.removeItem('twitter_oauth_state');
                localStorage.removeItem('twitter_code_verifier');
                popup.close();
                clearInterval(checkPopup);
                
                // Refresh connections
                fetchConnections();
              }
              
              if (popup.closed) {
                clearInterval(checkPopup);
                localStorage.removeItem('twitter_oauth_state');
                localStorage.removeItem('twitter_code_verifier');
              }
            } catch (error) {
              // Ignore errors from cross-origin frames
              if (!error.message.includes('cross-origin')) {
                console.error("Error in popup check:", error);
                clearInterval(checkPopup);
              }
            }
          }, 1000);
        }
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