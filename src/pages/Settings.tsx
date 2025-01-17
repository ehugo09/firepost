import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TopNavigation from "@/components/TopNavigation";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log("Settings - Starting sign out process");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Settings - Error during sign out:", error);
        toast.error("Une erreur est survenue lors de la déconnexion");
        return;
      }

      console.log("Settings - Successfully signed out");
      toast.success("Déconnexion réussie");
      navigate("/auth");
    } catch (err) {
      console.error("Settings - Unexpected error during sign out:", err);
      toast.error("Une erreur inattendue est survenue");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0B1121]">
      <TopNavigation />
      <main className="pt-20 px-4">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">Paramètres</h1>
          
          <div className="bg-white dark:bg-[#151B2E]/80 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700/50">
            <h2 className="text-lg font-medium mb-6 text-gray-800 dark:text-gray-200">Compte</h2>
            
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="w-full sm:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;