import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Index from './pages/Index';
import ComposeTwitter from './pages/ComposeTwitter';
import TwitterCallback from './pages/auth/TwitterCallback';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

function App() {
  // Gérer la confirmation d'email
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        console.log("Email confirmation detected, handling auth...");
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (session) {
            console.log("Session found after email confirmation, redirecting to dashboard");
            window.location.href = '/dashboard';
          }
        } catch (err) {
          console.error("Error handling email confirmation:", err);
          window.location.href = '/auth';
        }
      }
    };

    handleEmailConfirmation();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compose" element={<ComposeTwitter />} />
        <Route path="/auth/callback/twitter" element={<TwitterCallback />} />
        {/* Redirection par défaut pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;