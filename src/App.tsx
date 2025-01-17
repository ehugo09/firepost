import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Index from './pages/Index';
import ComposeTwitter from './pages/ComposeTwitter';
import TwitterCallback from './pages/auth/TwitterCallback';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Composant pour gérer la redirection après confirmation d'email
const EmailConfirmationHandler = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      
      if (hash) {
        console.log("Hash detected in URL:", hash);
        setIsProcessing(true);
        
        // Vérifier si c'est une erreur d'expiration
        if (hash.includes('error=access_denied') && hash.includes('error_code=otp_expired')) {
          console.log("Detected expired email confirmation link");
          // Nettoyer l'URL
          window.history.replaceState({}, document.title, window.location.pathname);
          setIsProcessing(false);
          // Afficher un message d'erreur explicatif
          toast.error("Le lien de confirmation a expiré. Veuillez vous reconnecter pour recevoir un nouveau lien.");
          navigate('/auth', { replace: true });
          return;
        }

        // Gérer la confirmation d'email normale
        if (hash.includes('access_token')) {
          console.log("Processing email confirmation with access token");
          
          try {
            // Augmenter le délai d'attente pour la session
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Vérifier la session plusieurs fois
            for (let i = 0; i < 3; i++) {
              const { data: { session }, error } = await supabase.auth.getSession();
              
              if (session) {
                console.log("Valid session found after confirmation");
                window.history.replaceState({}, document.title, window.location.pathname);
                toast.success("Email confirmé avec succès !");
                navigate('/dashboard', { replace: true });
                return;
              }
              
              if (i < 2) {
                // Attendre entre les tentatives
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
            
            // Si après toutes les tentatives, toujours pas de session
            console.log("No session found after multiple attempts");
            toast.error("La session n'a pas pu être établie. Veuillez réessayer.");
            navigate('/auth', { replace: true });
            
          } catch (err) {
            console.error("Error during email confirmation:", err);
            toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
            navigate('/auth', { replace: true });
          }
        }
        
        setIsProcessing(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  if (isProcessing) {
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