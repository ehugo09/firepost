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
        console.log("Dashboard - Starting authentication check");
        
        // Si nous avons un hash d'authentification, attendons un peu pour laisser le temps à la session de s'établir
        if (window.location.hash.includes('access_token')) {
          console.log("Dashboard - Access token detected in URL, waiting for session establishment");
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log("Dashboard - Checking session");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Dashboard - Error checking session:", error);
          navigate('/auth', { replace: true });
          return;
        }

        if (!session) {
          console.log("Dashboard - No active session, redirecting to auth");
          navigate('/auth', { replace: true });
          return;
        }

        console.log("Dashboard - User is authenticated, showing dashboard");
        setIsLoading(false);
      } catch (err) {
        console.error("Dashboard - Unexpected error:", err);
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