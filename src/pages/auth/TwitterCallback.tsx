import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TwitterService } from '@/services/twitter';
import { toast } from 'sonner';

const TwitterCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('TwitterCallback: Starting callback processing');
        console.log('Current URL:', window.location.href);
        
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        console.log('TwitterCallback: Received params:', {
          code: code ? 'present' : 'missing',
          state: state ? 'present' : 'missing'
        });
        
        if (!code || !state) {
          console.error('TwitterCallback: Missing code or state in callback');
          toast.error('Authentication failed: Missing parameters');
          navigate('/dashboard');
          return;
        }

        // Verify state matches stored state
        const storedState = sessionStorage.getItem('twitter_oauth_state');
        console.log('TwitterCallback: Stored state:', storedState);
        
        if (state !== storedState) {
          console.error('TwitterCallback: State mismatch', {
            received: state,
            stored: storedState
          });
          toast.error('Authentication failed: Invalid state');
          navigate('/dashboard');
          return;
        }

        console.log('TwitterCallback: State verification passed, proceeding with callback');
        await TwitterService.handleCallback(code, state);
        toast.success('Successfully connected to Twitter');
        
      } catch (error) {
        console.error('TwitterCallback: Error in callback:', error);
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