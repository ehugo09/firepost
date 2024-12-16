import { ConnectInstagram } from "@/components/instagram/ConnectInstagram";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FE] p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Welcome to PandaPost</h1>
        <ConnectInstagram />
      </motion.div>
    </div>
  );
};

export default Index;