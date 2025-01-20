import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface NetworksBoxProps {
  networks?: Array<{ name: string; icon: string; }>;
}

const NetworksBox = ({ networks }: NetworksBoxProps) => {
  const sanitizeUrl = (url: string) => {
    return url.replace(/:\/$/, '');
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Connected Networks</CardTitle>
        <ArrowUpRight className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {networks?.map((network, index) => (
            <div key={index} className="flex items-center p-2 rounded-full border border-gray-100 bg-white">
              <img src={sanitizeUrl(network.icon)} alt={network.name} className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">{network.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworksBox;