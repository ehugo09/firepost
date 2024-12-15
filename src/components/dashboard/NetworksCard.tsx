import { Card } from "@/components/ui/card";

interface NetworksCardProps {
  networks: Array<{ name: string; icon: string; lessons: number; hours: number }>;
}

const NetworksCard = ({ networks }: NetworksCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">Connected Networks</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">4 Active</span>
      </div>
      <div className="space-y-2">
        {networks.map((network, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span>{network.name}</span>
            <span className="text-green-500">●</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NetworksCard;