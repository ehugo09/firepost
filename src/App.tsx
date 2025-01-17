import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Index from './pages/Index';
import ComposeTwitter from './pages/ComposeTwitter';
import TwitterCallback from './pages/auth/TwitterCallback';
import Settings from './pages/Settings';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Authenticated' : 'Not authenticated');
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session ? 'Authenticated' : 'Not authenticated');
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/compose" 
          element={isAuthenticated ? <ComposeTwitter /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/auth" />} 
        />
        <Route path="/auth/callback/twitter" element={<TwitterCallback />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} 
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;