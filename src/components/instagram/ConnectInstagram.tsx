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
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      console.log("Fetching Instagram connections...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (!sessionData.session) {
        console.log("No active session found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('platform', 'instagram');

      if (error) {
        throw error;
      }

      console.log("Fetched Instagram connections:", data);
      setConnections(data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load Instagram connection");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // This is where we'll implement the Instagram OAuth flow
      console.log("Initiating Instagram connection...");
      toast.info("Instagram integration coming soon!");
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect to Instagram");
    } finally {
      setIsConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {connections.length > 0 ? (
        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              {connection.profile_picture && (
                <img 
                  src={connection.profile_picture} 
                  alt={connection.username || ''} 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{connection.username}</p>
                <p className="text-sm text-gray-500">Connected to Instagram</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info("Disconnect feature coming soon!")}
              >
                Disconnect
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Instagram className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Connect Instagram Account</h3>
          <p className="text-gray-500 mb-4">Share and schedule posts directly to Instagram</p>
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="gap-2"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                <Instagram className="w-4 h-4" />
                Connect Instagram
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};