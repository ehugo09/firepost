import TopNavigation from "@/components/TopNavigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, LogOut } from "lucide-react";

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

  const handleTwitterDisconnect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to disconnect Twitter.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('social_connections')
        .delete()
        .eq('platform', 'twitter')
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Twitter disconnected",
        description: "Your Twitter account has been disconnected successfully.",
      });
    } catch (error) {
      console.error('Error disconnecting Twitter:', error);
      toast({
        title: "Error disconnecting Twitter",
        description: "There was a problem disconnecting your Twitter account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0B1121] transition-colors duration-300">
      <TopNavigation />
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Settings</h1>
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Account Section */}
            <div className="bg-white dark:bg-[#151B2E] rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Account</h2>
              <Button 
                variant="destructive"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>

            {/* Social Connections Section */}
            <div className="bg-white dark:bg-[#151B2E] rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Social Connections</h2>
              <Button 
                variant="destructive"
                onClick={handleTwitterDisconnect}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Twitter
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;