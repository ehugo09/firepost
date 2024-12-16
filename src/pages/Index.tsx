import { InstagramIntegration } from "@/components/instagram/InstagramIntegration";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FE] p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to PandaPost</h1>
          <p className="text-gray-600">Connect your social media accounts to get started</p>
        </div>
        <InstagramIntegration />
      </motion.div>
    </div>
  );
};

export default Index;