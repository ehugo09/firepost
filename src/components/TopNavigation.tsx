import { MessageSquare, BarChart2, Calendar, Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const TopNavigation = () => {
  return (
    <nav className="fixed w-full z-30 top-4 flex justify-center">
      <div className="max-w-[800px] w-full mx-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full relative">
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
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={item.label}
                >
                  <item.icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </motion.button>
              ))}
            </div>
            
            {/* Centered Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img 
                src="/lovable-uploads/3f40cdf6-2843-4be4-ae02-bc2be3d3f229.png" 
                alt="Logo" 
                className="h-8 w-8 -mt-1 dark:hidden"
              />
              <img 
                src="/lovable-uploads/1edf94f0-8f47-41f6-8a57-8c44f1f4e3f0.png" 
                alt="Logo" 
                className="h-8 w-8 -mt-1 hidden dark:block"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                <Input 
                  placeholder="Search..." 
                  className="pl-7 w-40 h-8 bg-gray-50/50 dark:bg-gray-700/50 text-sm rounded-full dark:text-gray-300 dark:placeholder:text-gray-500"
                />
              </div>
              <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
              <ThemeToggle />
              <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;