import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TwitterService } from '@/services/twitter';
import { toast } from 'sonner';

const TwitterCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Processing Twitter OAuth callback...');
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        if (!code || !state) {
          console.error('Missing code or state in callback');
          toast.error('Authentication failed: Missing parameters');
          navigate('/dashboard');
          return;
        }

        // Verify state matches stored state
        const storedState = sessionStorage.getItem('twitter_oauth_state');
        if (state !== storedState) {
          console.error('State mismatch in OAuth callback');
          toast.error('Authentication failed: Invalid state');
          navigate('/dashboard');
          return;
        }

        await TwitterService.handleCallback(code, state);
        toast.success('Successfully connected to Twitter');
        
      } catch (error) {
        console.error('Error handling Twitter callback:', error);
        toast.error('Failed to complete Twitter authentication');
      } finally {
        // Clean up session storage
        sessionStorage.removeItem('twitter_oauth_state');
        sessionStorage.removeItem('twitter_oauth_verifier');
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