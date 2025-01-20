import TopNavigation from "@/components/TopNavigation";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

const Dashboard = () => {
  const progressData = [
    { label: 'In progress', value: 8, color: '#8B5CF6' },
    { label: 'Completed', value: 12, color: '#2ECC71' },
    { label: 'Upcoming', value: 14, color: '#F97316' },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0B1121] transition-colors duration-300 flex w-full">
        <AppSidebar />
        <div className="flex-1 grid grid-rows-[auto,1fr]">
          <div className="w-full">
            <TopNavigation />
          </div>
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex items-center"
          >
            <DashboardGrid progressData={progressData} />
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;