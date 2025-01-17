import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Index from './pages/Index';
import ComposeTwitter from './pages/ComposeTwitter';
import TwitterCallback from './pages/auth/TwitterCallback';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EmailConfirmationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Starting email confirmation handler");
    
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.id);

      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in successfully:", session.user.id);
        // Nettoyer l'URL et rediriger
        window.history.replaceState({}, document.title, '/dashboard');
        toast.success("Connexion réussie !");
        navigate('/dashboard', { replace: true });
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        navigate('/auth', { replace: true });
      }
    });

    // Vérifier s'il y a une session active au chargement
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Initial session check:", session?.user?.id || "No session");
      
      if (error) {
        console.error("Session check error:", error);
        return;
      }

      if (session) {
        console.log("Active session found:", session.user.id);
        navigate('/dashboard', { replace: true });
      }
    };

    checkSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
};

function App() {
  return (
    <Router>
      <EmailConfirmationHandler />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compose" element={<ComposeTwitter />} />
        <Route path="/auth/callback/twitter" element={<TwitterCallback />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;