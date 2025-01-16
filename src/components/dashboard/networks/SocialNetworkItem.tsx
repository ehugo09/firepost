import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";
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
      toast.info(`${name} integration coming soon!`);
    } catch (error) {
      console.error(`Error connecting to ${name}:`, error);
      toast.error(`Failed to connect to ${name}`);
    }
  };

  return (
    <div className="p-3 rounded-lg border border-gray-700/50 bg-[#1A2235] hover:bg-[#1E2943] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-300">
          {icon}
          <span className="text-sm font-medium">{name}</span>
        </div>
        {isConnected ? (
          <span className="text-green-500">●</span>
        ) : (
          <button 
            onClick={handleConnect}
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialNetworkItem;