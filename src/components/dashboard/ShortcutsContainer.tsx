import { Card } from "@/components/ui/card";
import { Send, FilePlus, ChartBar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShortcutsContainer = () => {
  const navigate = useNavigate();
  
  const shortcuts = [
    { icon: <Send className="w-5 h-5" />, label: "New Post", action: () => navigate("/compose") },
    { icon: <FilePlus className="w-5 h-5" />, label: "Schedule", action: () => console.log("Schedule") },
    { icon: <ChartBar className="w-5 h-5" />, label: "Analytics", action: () => console.log("Analytics") },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Messages", action: () => console.log("Messages") },
  ];

  return (
    <Card className="p-4 h-full bg-white dark:bg-[#151B2E]/80 backdrop-blur-lg border-gray-200 dark:border-gray-700/50">
      <h2 className="text-sm font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map((shortcut, index) => (
          <button
            key={index}
            onClick={shortcut.action}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-[#1A2235] hover:bg-gray-100 dark:hover:bg-[#1E2943] transition-colors"
          >
            <div className="text-gray-600 dark:text-gray-400 mb-2">{shortcut.icon}</div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{shortcut.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default ShortcutsContainer;