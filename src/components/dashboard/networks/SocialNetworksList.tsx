import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import SocialNetworkItem from "./SocialNetworkItem";
import { SocialConnection } from "../NetworksCard";

interface SocialNetworksListProps {
  connections: SocialConnection[];
  onConnectionUpdate: () => void;
}

const SocialNetworksList = ({ connections, onConnectionUpdate }: SocialNetworksListProps) => {
  const socialNetworks = [
    { icon: <Twitter className="w-4 h-4" />, name: "Twitter", platform: "twitter" },
    { icon: <Instagram className="w-4 h-4" />, name: "Instagram", platform: "instagram" },
    { icon: <Facebook className="w-4 h-4" />, name: "Facebook", platform: "facebook" },
    { icon: <Linkedin className="w-4 h-4" />, name: "LinkedIn", platform: "linkedin" }
  ];

  const isConnected = (platform: string) => {
    return connections.some(conn => conn.platform === platform);
  };

  return (
    <div className="space-y-2 mb-4">
      {socialNetworks.map((network, index) => (
        <SocialNetworkItem
          key={index}
          {...network}
          isConnected={isConnected(network.platform)}
          onConnect={onConnectionUpdate}
        />
      ))}
    </div>
  );
};

export default SocialNetworksList;