import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SocialNetworkItemProps {
  icon: React.ReactElement<LucideIcon>;
  name: string;
  platform: string;
  isConnected: boolean;
  onConnect: () => void;
}

const SocialNetworkItem = ({
  icon,
  name,
  platform,
  isConnected,
  onConnect,
}: SocialNetworkItemProps) => {
  const handleConnect = async () => {
    try {
      if (platform === 'twitter') {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('Please login first');
          return;
        }

        console.log('Initiating Twitter auth process...');
        
        const { data, error } = await supabase.functions.invoke('twitter-auth', {
          method: 'POST',
          body: { 
            action: 'request_token',
            user_id: session.user.id
          }
        });

        console.log('Twitter auth response:', { data, error });

        if (error) throw error;
        if (!data?.oauth_token) {
          throw new Error('No oauth_token received');
        }
        
        window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${data.oauth_token}`;
      } else {
        toast.info(`${name} integration coming soon!`);
      }
    } catch (error) {
      console.error(`Error connecting to ${name}:`, error);
      toast.error(`Failed to connect to ${name}`);
    }
  };

  return (
    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-[#1A2235] hover:bg-gray-100 dark:hover:bg-[#1E2943] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          {icon}
          <span className="text-sm font-medium">{name}</span>
        </div>
        {isConnected ? (
          <span className="text-green-500">●</span>
        ) : (
          <button 
            onClick={handleConnect}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialNetworkItem;