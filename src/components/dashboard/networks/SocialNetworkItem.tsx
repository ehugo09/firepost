import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { TwitterService } from "@/services/twitter";

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
        await TwitterService.initiateAuth();
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