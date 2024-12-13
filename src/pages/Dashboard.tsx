import TopNavigation from "@/components/TopNavigation";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { motion } from "framer-motion";

const Dashboard = () => {
  const chartData = [
    { name: 'Mon', value: 2.5 },
    { name: 'Tue', value: 2.1 },
    { name: 'Wed', value: 3.8 },
    { name: 'Thu', value: 2.4 },
    { name: 'Fri', value: 4.2 },
    { name: 'Sat', value: 3.1 },
    { name: 'Sun', value: 2.8 },
  ];

  const networks = [
    { name: 'Mondly', icon: 'https://api.iconify.design/logos:twitter.svg', lessons: 8, hours: 12.5 },
    { name: 'Zoom', icon: 'https://api.iconify.design/logos:zoom.svg', lessons: 5, hours: 6.8 },
    { name: 'Google Meet', icon: 'https://api.iconify.design/logos:google-meet.svg', lessons: 3, hours: 4.2 },
    { name: 'Skype', icon: 'https://api.iconify.design/logos:skype.svg', lessons: 2, hours: 2.5 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <TopNavigation />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20 px-8 max-w-[1400px] mx-auto"
      >
        <div className="py-4">
          <DashboardGrid 
            chartData={chartData}
            networks={networks}
          />
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;