import { motion } from "framer-motion";
import { ArrowRight, BarChart2, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex flex-col items-center justify-center mb-8">
            <motion.img
              src="/lovable-uploads/09171096-3f2b-41d5-8b3e-092b36199d42.png"
              alt="Pandapost Logo"
              className="w-24 h-24 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl font-bold text-primary mb-2"
            >
              Pandapost
            </motion.h1>
          </div>
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium inline-block mb-6">
            Simplify Your Social Media Management
          </span>
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            One Platform, All Your Social Media
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Manage all your social networks, schedule posts, and analyze performance from one beautiful interface.
          </p>
          <Button 
            size="lg" 
            className="hover-scale" 
            onClick={handleGetStarted}
          >
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card p-6 rounded-2xl"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Unified Inbox",
    description: "All your social media messages in one place. Never miss an interaction.",
    icon: MessageCircle,
  },
  {
    title: "Smart Scheduling",
    description: "Schedule posts at the perfect time across all your networks.",
    icon: Calendar,
  },
  {
    title: "Advanced Analytics",
    description: "Get deep insights into your social media performance.",
    icon: BarChart2,
  },
];

export default Index;