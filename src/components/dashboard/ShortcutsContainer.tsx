import { Card } from "@/components/ui/card";
import { Send, FilePlus, ChartBar, MessageSquare, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const ShortcutsContainer = () => {
  const navigate = useNavigate();
  
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
      action: () => navigate("/compose/twitter"),
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950"
    },
    { 
      icon: <Instagram className="w-6 h-6" />, 
      label: "Instagram",
      action: () => console.log("Instagram selected"),
      bgColor: "hover:bg-pink-50 dark:hover:bg-pink-950"
    },
    { 
      icon: <Facebook className="w-6 h-6" />, 
      label: "Facebook",
      action: () => console.log("Facebook selected"),
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950"
    },
    { 
      icon: <Linkedin className="w-6 h-6" />, 
      label: "LinkedIn",
      action: () => console.log("LinkedIn selected"),
      bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950"
    }
  ];

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
                  {socialNetworks.map((network, idx) => (
                    <button
                      key={idx}
                      onClick={network.action}
                      className={`flex items-center gap-3 p-4 rounded-lg border ${network.bgColor} transition-colors`}
                    >
                      {network.icon}
                      <span className="text-sm font-medium">{network.label}</span>
                    </button>
                  ))}
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