import { MessageSquare, BarChart2, Calendar, Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const TopNavigation = () => {
  return (
    <nav className="fixed w-full z-30 top-4 flex justify-center">
      <div className="max-w-[800px] w-full mx-4">
        <div className="bg-background/80 border border-border rounded-full relative backdrop-blur-lg">
          <div className="flex items-center justify-between h-12 px-6">
            <div className="flex items-center space-x-6">
              {[
                { icon: MessageSquare, label: 'Messages' },
                { icon: BarChart2, label: 'Analytics' },
                { icon: Calendar, label: 'Schedule' },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  title={item.label}
                >
                  <item.icon className="h-4 w-4 text-foreground/70" />
                </motion.button>
              ))}
            </div>
            
            {/* Centered Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img 
                src="/lovable-uploads/0fbfd7c5-60f0-46ee-9449-8836a437e7ff.png" 
                alt="Logo" 
                className="h-8 w-8 -mt-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-foreground/50" />
                <Input 
                  placeholder="Search..." 
                  className="pl-7 w-40 h-8 bg-muted/50 text-sm rounded-full border-border text-foreground placeholder:text-foreground/50"
                />
              </div>
              <button className="p-1.5 rounded-full hover:bg-muted">
                <Bell className="h-4 w-4 text-foreground/70" />
              </button>
              <ThemeToggle />
              <button className="p-1.5 rounded-full hover:bg-muted">
                <Settings className="h-4 w-4 text-foreground/70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;