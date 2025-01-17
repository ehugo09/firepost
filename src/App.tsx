import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Index from './pages/Index';
import ComposeTwitter from './pages/ComposeTwitter';
import TwitterCallback from './pages/auth/TwitterCallback';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Composant pour gérer la redirection après confirmation d'email
const EmailConfirmationHandler = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        console.log("Email confirmation detected, checking session...");
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error("Session error:", error);
            navigate('/auth', { replace: true });
            return;
          }
          
          if (session) {
            console.log("Valid session found, redirecting to dashboard");
            navigate('/dashboard', { replace: true });
          } else {
            console.log("No session found, redirecting to auth");
            navigate('/auth', { replace: true });
          }
        } catch (err) {
          console.error("Error during email confirmation:", err);
          navigate('/auth', { replace: true });
        }
      }
      setIsChecking(false);
    };

    handleEmailConfirmation();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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