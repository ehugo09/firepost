import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Auth page - Checking session:", session ? "Session exists" : "No session");
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Error checking authentication status");
          return;
        }

        if (session) {
          console.log("User already authenticated, redirecting to dashboard");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Unexpected error during session check:", error);
        toast.error("An unexpected error occurred");
      }
    };

    // Initial session check
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' && session) {
        console.log("Sign in successful, redirecting to dashboard");
        toast.success("Successfully signed in!");
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img 
            src="/lovable-uploads/09171096-3f2b-41d5-8b3e-092b36199d42.png" 
            alt="FirePost Logo" 
            className="h-12 w-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to FirePost</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your social media presence</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2ECC71',
                    brandAccent: '#27AE60',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={["google"]}
            redirectTo={`${window.location.origin}/dashboard`}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;