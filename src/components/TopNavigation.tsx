import { MessageSquare, BarChart2, Calendar, Bell, Settings } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

const TopNavigation = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="w-[1024px] mx-auto">
      <div className="bg-white/80 dark:bg-[#151B2E]/80 border border-gray-200/50 dark:border-gray-700/50 rounded-full relative backdrop-blur-lg">
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
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A2235]/80 transition-colors"
                title={item.label}
              >
                <item.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            ))}
          </div>
          
          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img 
              src={theme === 'dark' 
                ? "/lovable-uploads/3a4528ae-ab98-4681-8492-4c1e2e673776.png"
                : "/lovable-uploads/739f8d1a-6631-4702-8935-050272107949.png"
              } 
              alt="FirePost Logo" 
              className="h-6"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A2235]/80">
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <ThemeToggle />
            <button 
              onClick={() => navigate('/settings')}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A2235]/80"
            >
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;