import { MessageSquare, BarChart2, Calendar, Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const TopNavigation = () => {
  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full z-30 top-0">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between h-14 px-8">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/09171096-3f2b-41d5-8b3e-092b36199d42.png" 
                alt="Pandapost Logo" 
                className="h-6 w-6"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">Pandapost</span>
            </div>
            <div className="flex items-center space-x-1">
              {[
                { icon: MessageSquare, label: 'Messages' },
                { icon: BarChart2, label: 'Analytics' },
                { icon: Calendar, label: 'Schedule' },
              ].map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
                  title={item.label}
                >
                  <item.icon className="h-4 w-4 text-gray-600" />
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
              <Input 
                placeholder="Search..." 
                className="pl-7 w-48 h-8 bg-gray-50/50 text-sm"
              />
            </div>
            <button className="p-1.5 rounded-full hover:bg-gray-100">
              <Bell className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100">
              <Settings className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;