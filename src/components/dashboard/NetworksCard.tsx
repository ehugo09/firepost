import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SocialNetworksList from "./networks/SocialNetworksList";
import NetworkStats from "./networks/NetworkStats";
import { toast } from "sonner";

export interface SocialConnection {
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
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('social_connections')
        .select('*');

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load social connections");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-4 h-full bg-white dark:bg-[#151B2E]/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 h-full bg-white dark:bg-[#151B2E]/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200">Social Networks</h2>
        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-medium">
          {connections.length} Active
        </span>
      </div>

      <SocialNetworksList 
        connections={connections} 
        onConnectionUpdate={fetchConnections} 
      />

      <NetworkStats />
    </Card>
  );
};

export default NetworksCard;