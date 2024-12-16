import { Card } from "@/components/ui/card";

interface NetworksCardProps {
  networks: Array<{ name: string; icon: string; lessons: number; hours: number }>;
}

const NetworksCard = ({ networks }: NetworksCardProps) => {
  return (
    <Card className="p-4 h-full bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold">Connected Networks</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">4 Active</span>
      </div>
      <div className="space-y-4">
        {networks.map((network, index) => (
          <div key={index} className="p-4 rounded-lg border bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{network.name}</span>
              </div>
              <span className="text-green-500">●</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <div>{network.lessons} lessons</div>
              <div>{network.hours} hours</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NetworksCard;