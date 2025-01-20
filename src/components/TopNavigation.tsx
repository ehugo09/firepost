import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TopNavigation = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="max-w-[1024px] mx-auto px-4 mt-4">
      <div className="bg-white/80 dark:bg-[#151B2E]/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl relative backdrop-blur-lg">
        <div className="flex items-center justify-end h-12 px-6">
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;