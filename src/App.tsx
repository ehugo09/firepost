import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';

function App() {
  const [session, setSession] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", !!session);
        setSession(!!session);
      } catch (error) {
        console.error("Error checking session:", error);
        setSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", !!session);
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={session ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/auth" replace />} />
        <Route path="/" element={<Navigate to={session ? "/dashboard" : "/auth"} replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;