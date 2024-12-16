import { Card } from "@/components/ui/card";
import { Send, FilePlus, ChartBar, MessageSquare } from "lucide-react";

const ShortcutsContainer = () => {
  const shortcuts = [
    { icon: <Send className="w-5 h-5" />, label: "New Post", action: () => console.log("New post") },
    { icon: <FilePlus className="w-5 h-5" />, label: "Schedule", action: () => console.log("Schedule") },
    { icon: <ChartBar className="w-5 h-5" />, label: "Analytics", action: () => console.log("Analytics") },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Messages", action: () => console.log("Messages") },
  ];

  return (
    <Card className="p-4 h-full bg-white">
      <h2 className="text-sm font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map((shortcut, index) => (
          <button
            key={index}
            onClick={shortcut.action}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="text-primary mb-2">{shortcut.icon}</div>
            <span className="text-xs font-medium text-gray-600">{shortcut.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default ShortcutsContainer;