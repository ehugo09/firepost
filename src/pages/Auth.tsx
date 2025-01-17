import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Auth page - Checking session");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session check error:", sessionError);
          setError("Failed to check authentication status");
          return;
        }

        // Ne pas rediriger si nous sommes en train de confirmer l'email
        if (session && !window.location.hash.includes('access_token')) {
          console.log("User already authenticated, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      // Ne pas rediriger si nous sommes en train de confirmer l'email
      if (event === 'SIGNED_IN' && session && !window.location.hash.includes('access_token')) {
        console.log("Sign in successful, redirecting to dashboard");
        toast.success("Successfully signed in!");
        navigate("/dashboard", { replace: true });
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setError(null);
      }
    });

    return () => {
      console.log("Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#F8F9FE] flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-8 text-center"
        >
          <img 
            src="/lovable-uploads/09171096-3f2b-41d5-8b3e-092b36199d42.png" 
            alt="FirePost Logo" 
            className="h-12 w-12 mx-auto mb-4 drop-shadow-sm"
          />
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to FirePost</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your social media presence</p>
        </motion.div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                label: 'text-sm font-medium text-gray-700',
                loader: 'animate-spin',
              },
            }}
            providers={["google"]}
            redirectTo={`${window.location.origin}/dashboard`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;