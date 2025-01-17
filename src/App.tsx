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

        // Si c'est un access_token (confirmation d'email réussie)
        if (hash.includes('access_token')) {
          console.log("Processing email confirmation with access_token");
          
          try {
            // Première attente pour laisser le temps à Supabase de traiter le token
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Essayer de récupérer la session plusieurs fois
            for (let attempt = 1; attempt <= 5; attempt++) {
              console.log(`Tentative ${attempt} de récupération de session...`);
              
              const { data: { session }, error } = await supabase.auth.getSession();
              
              if (error) {
                console.error("Erreur lors de la récupération de la session:", error);
                continue;
              }

              if (session) {
                console.log("Session trouvée avec succès:", session.user.id);
                window.history.replaceState({}, document.title, '/dashboard');
                toast.success("Email confirmé avec succès !");
                navigate('/dashboard', { replace: true });
                return;
              }

              // Si ce n'est pas la dernière tentative, attendre avant de réessayer
              if (attempt < 5) {
                console.log("Attente avant nouvelle tentative...");
                await new Promise(resolve => setTimeout(resolve, 1500));
              }
            }

            // Si toutes les tentatives ont échoué
            console.error("Impossible d'établir une session après 5 tentatives");
            toast.error("La connexion n'a pas pu être établie. Veuillez vous reconnecter.");
            navigate('/auth', { replace: true });
          } catch (err) {
            console.error("Erreur inattendue lors de la confirmation:", err);
            toast.error("Une erreur est survenue. Veuillez réessayer.");
            navigate('/auth', { replace: true });
          }
        }
        
        setIsProcessing(false);
      }
    };

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Changement d'état d'authentification:", event, session ? "Session présente" : "Pas de session");
      
      if (event === 'SIGNED_IN' && session) {
        console.log("Utilisateur connecté:", session.user.id);
        navigate('/dashboard', { replace: true });
      }
    });

    handleEmailConfirmation();

    return () => {
      subscription.unsubscribe();
    };
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