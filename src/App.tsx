import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';

function App() {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", !!session);
      setSession(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", !!session);
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Attendre que la session soit vérifiée
  if (session === null) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={session ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/auth"} />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;