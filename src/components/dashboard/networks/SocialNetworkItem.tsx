import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { initiateTwitterAuth } from "@/services/twitter/twitter-auth";
import { toast } from "sonner";

interface SocialNetworkItemProps {
  icon: React.ReactElement<LucideIcon>;
  name: string;
  platform: string;
  isConnected: boolean;
  onConnect: (name: string, platform: string) => void;
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
        await initiateTwitterAuth();
        onConnect(name, platform);
      } else {
        toast.info(`${name} integration coming soon!`);
      }
    } catch (error) {
      console.error(`Error connecting to ${name}:`, error);
      toast.error(`Failed to connect to ${name}`);
    }
  };

  return (
    <div className="p-2 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{name}</span>
        </div>
        {isConnected ? (
          <span className="text-green-500">●</span>
        ) : (
          <button 
            onClick={handleConnect}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialNetworkItem;