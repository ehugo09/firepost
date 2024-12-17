import { Card } from "@/components/ui/card";
import { Send, FilePlus, ChartBar, MessageSquare, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SocialConnection {
  platform: string;
  username: string | null;
}

const ShortcutsContainer = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  
  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('social_connections')
        .select('platform, username');

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };
  
  const shortcuts = [
    { icon: <Send className="w-5 h-5" />, label: "New Post", action: () => console.log("New post") },
    { icon: <FilePlus className="w-5 h-5" />, label: "Schedule", action: () => console.log("Schedule") },
    { icon: <ChartBar className="w-5 h-5" />, label: "Analytics", action: () => console.log("Analytics") },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Messages", action: () => console.log("Messages") },
  ];

  const socialNetworks = [
    { 
      icon: <Twitter className="w-6 h-6" />, 
      label: "Twitter/X", 
      platform: "twitter",
      action: () => navigate("/compose/twitter"),
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950"
    },
    { 
      icon: <Instagram className="w-6 h-6" />, 
      label: "Instagram",
      platform: "instagram",
      action: () => console.log("Instagram selected"),
      bgColor: "hover:bg-pink-50 dark:hover:bg-pink-950"
    },
    { 
      icon: <Facebook className="w-6 h-6" />, 
      label: "Facebook",
      platform: "facebook",
      action: () => console.log("Facebook selected"),
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950"
    },
    { 
      icon: <Linkedin className="w-6 h-6" />, 
      label: "LinkedIn",
      platform: "linkedin",
      action: () => console.log("LinkedIn selected"),
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950"
    }
  ];

  const isConnected = (platform: string) => {
    return connections.some(conn => conn.platform === platform);
  };

  return (
    <Card className="p-4 h-full bg-white dark:bg-gray-800">
      <h2 className="text-sm font-semibold mb-4 dark:text-white">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map((shortcut, index) => (
          index === 0 ? (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <button
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="text-primary dark:text-primary-foreground mb-2">{shortcut.icon}</div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{shortcut.label}</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Platform</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  {socialNetworks.map((network, idx) => {
                    const connected = isConnected(network.platform);
                    return (
                      <button
                        key={idx}
                        onClick={connected ? network.action : undefined}
                        disabled={!connected}
                        className={`flex items-center gap-3 p-4 rounded-lg border ${network.bgColor} transition-colors ${
                          !connected ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {network.icon}
                        <div className="text-left">
                          <span className="text-sm font-medium block">{network.label}</span>
                          {connected ? (
                            <span className="text-xs text-green-600">Connected</span>
                          ) : (
                            <span className="text-xs text-gray-500">Not connected</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <button
              key={index}
              onClick={shortcut.action}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="text-primary dark:text-primary-foreground mb-2">{shortcut.icon}</div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{shortcut.label}</span>
            </button>
          )
        ))}
      </div>
    </Card>
  );
};

export default ShortcutsContainer;