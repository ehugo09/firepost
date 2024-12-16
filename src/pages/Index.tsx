import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Checking auth state:", session ? "User is authenticated" : "No active session");
      
      if (session) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading state while checking auth
  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </motion.div>
    </div>
  );
};

export default Index;