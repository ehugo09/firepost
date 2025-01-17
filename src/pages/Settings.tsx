import TopNavigation from "@/components/TopNavigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0B1121] transition-colors duration-300">
      <TopNavigation />
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-2xl font-bold mb-8">Settings</h1>
          
          <div className="bg-white dark:bg-[#151B2E] rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Account</h2>
            <Button 
              variant="destructive"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;