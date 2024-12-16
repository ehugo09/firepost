import { Card } from "@/components/ui/card";

interface NetworksCardProps {
  networks: Array<{ name: string; icon: string; lessons: number; hours: number }>;
}

const NetworksCard = ({ networks }: NetworksCardProps) => {
  return (
    <Card className="p-2 h-full bg-white"> {/* Reduced padding from p-3 to p-2 */}
      <div className="flex justify-between items-center mb-2"> {/* Reduced margin */}
        <h2 className="text-sm font-semibold">Connected Networks</h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">4 Active</span>
      </div>
      <div className="space-y-2"> {/* Reduced gap from space-y-3 to space-y-2 */}
        {networks.map((network, index) => (
          <div key={index} className="p-2 rounded-lg border bg-gray-50"> {/* Reduced padding from p-3 to p-2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{network.name}</span>
              </div>
              <span className="text-green-500">●</span>
            </div>
            <div className="mt-1.5 text-xs text-gray-500"> {/* Reduced margin from mt-2 */}
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