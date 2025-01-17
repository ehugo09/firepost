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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Starting auth initialization...");
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        console.log("Initial session state:", session ? "Authenticated" : "Not authenticated");
        setIsAuthenticated(!!session);
        
        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log("Auth state changed:", _event, session ? "Authenticated" : "Not authenticated");
          setIsAuthenticated(!!session);
        });

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Unexpected error during auth initialization:", err);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      console.log("Access denied - redirecting to auth");
      return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
  };

  // Public Route component
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      console.log("User is authenticated - redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
  };

  if (isLoading) {
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
        <Route path="/auth" element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/compose" element={
          <ProtectedRoute>
            <ComposeTwitter />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/auth/callback/twitter" element={<TwitterCallback />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;