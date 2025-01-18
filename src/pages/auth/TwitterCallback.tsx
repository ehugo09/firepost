import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TwitterCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session to confirm the user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('No session found');
        }

        // Get oauth_token and oauth_verifier from URL
        const urlParams = new URLSearchParams(window.location.search);
        const oauthToken = urlParams.get('oauth_token');
        const oauthVerifier = urlParams.get('oauth_verifier');

        if (!oauthToken || !oauthVerifier) {
          throw new Error('Missing OAuth parameters');
        }

        // Call our edge function to exchange the tokens
        const { data, error } = await supabase.functions.invoke('twitter-auth', {
          method: 'POST',
          body: { 
            action: 'access_token',
            oauth_token: oauthToken,
            oauth_verifier: oauthVerifier,
            user_id: session.user.id
          }
        });

        if (error) throw error;
        
        console.log('Twitter authentication successful:', data);
        toast.success('Successfully connected to Twitter!');
        navigate('/dashboard');
        
      } catch (error) {
        console.error('Error in Twitter callback:', error);
        toast.error('Failed to complete authentication');
        navigate('/dashboard');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Completing authentication...</p>
      </div>
    </div>
  );
};

export default TwitterCallback;