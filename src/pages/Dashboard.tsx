import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="h-screen bg-[#f8fafc] dark:bg-[#0B1121] transition-colors duration-300 flex w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <DashboardGrid />
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;