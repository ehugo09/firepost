import TopNavigation from "@/components/TopNavigation";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { motion } from "framer-motion";

const Dashboard = () => {
  const progressData = [
    { label: 'In progress', value: 8, color: '#8B5CF6' },
    { label: 'Completed', value: 12, color: '#2ECC71' },
    { label: 'Upcoming', value: 14, color: '#F97316' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0B1121] transition-colors duration-300">
      <div className="h-screen flex flex-col">
        <div className="flex-none pt-4">
          <TopNavigation />
        </div>
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 overflow-y-auto py-8"
        >
          <DashboardGrid progressData={progressData} />
        </motion.main>
      </div>
    </div>
  );
};

export default Dashboard;