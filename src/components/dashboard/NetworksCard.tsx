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

  return (
    <Card className="p-2 h-full bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">Social Networks</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
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