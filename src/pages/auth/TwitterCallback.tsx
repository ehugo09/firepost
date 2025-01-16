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

        // Process the callback
        await TwitterService.handleCallback(code, state);
        
        // Close this window if it's a popup
        if (window.opener) {
          console.log('TwitterCallback: Closing popup window');
          window.close();
        } else {
          console.log('TwitterCallback: Not in popup, redirecting to dashboard');
          navigate('/dashboard');
        }
        
        toast.success('Successfully connected to Twitter');
        
      } catch (error) {
        console.error('TwitterCallback: Error in callback:', error);
        toast.error('Failed to complete Twitter authentication');
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