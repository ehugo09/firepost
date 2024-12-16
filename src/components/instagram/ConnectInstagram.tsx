import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Instagram } from "lucide-react";

interface SocialConnection {
  id: string;
  user_id: string;
  platform: string;
  access_token: string | null;
  platform_user_id: string | null;
  username: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

export const ConnectInstagram = () => {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session) {
      fetchConnections();
    }
  }, []);

  const fetchConnections = async () => {
    try {
      console.log("Fetching social connections...");
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('platform', 'instagram');

      if (error) {
        console.error("Error fetching connections:", error);
        toast.error("Failed to load Instagram connection");
        return;
      }

      console.log("Fetched connections:", data);
      setConnections(data || []);
    } catch (error) {
      console.error("Error in fetchConnections:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    // We'll implement the Instagram OAuth flow here in the next step
    console.log("Connecting to Instagram...");
    toast.info("Instagram integration coming soon!");
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Instagram Integration</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : connections.length > 0 ? (
        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center gap-3">
              {connection.profile_picture && (
                <img 
                  src={connection.profile_picture} 
                  alt={connection.username || ''} 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{connection.username}</p>
                <p className="text-sm text-gray-500">Connected to Instagram</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No Instagram account connected</p>
          <Button onClick={handleConnect} className="gap-2">
            <Instagram className="w-4 h-4" />
            Connect Instagram
          </Button>
        </div>
      )}
    </div>
  );
};