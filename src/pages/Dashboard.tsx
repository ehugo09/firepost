import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TopNavigation from "@/components/TopNavigation";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const progressData = [
    { label: 'In progress', value: 8, color: '#8B5CF6' },
    { label: 'Completed', value: 12, color: '#2ECC71' },
    { label: 'Upcoming', value: 14, color: '#F97316' },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Si nous avons un hash dans l'URL, attendons un peu pour laisser Supabase établir la session
        if (window.location.hash) {
          console.log("Hash detected in URL, waiting for session to establish");
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Nettoyons l'URL du hash
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        console.log("Dashboard - Checking authentication");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          navigate('/auth', { replace: true });
          return;
        }

        if (!session) {
          console.log("No active session, redirecting to auth");
          navigate('/auth', { replace: true });
          return;
        }

        console.log("User is authenticated, showing dashboard");
        setIsLoading(false);
      } catch (err) {
        console.error("Unexpected error:", err);
        navigate('/auth', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0B1121] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0B1121] transition-colors duration-300">
      <TopNavigation />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-2"
      >
        <DashboardGrid progressData={progressData} />
      </motion.main>
    </div>
  );
};

export default Dashboard;