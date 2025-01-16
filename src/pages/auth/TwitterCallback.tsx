import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TwitterService } from '@/services/twitter';
import { toast } from 'sonner';

const TwitterCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const oauth_token = params.get('oauth_token');
        const oauth_verifier = params.get('oauth_verifier');

        if (!oauth_token || !oauth_verifier) {
          toast.error('Authentication failed: Missing parameters');
          navigate('/dashboard');
          return;
        }

        await TwitterService.handleCallback(oauth_token, oauth_verifier);
        toast.success('Successfully connected to Twitter!');
        navigate('/dashboard');
        
      } catch (error) {
        console.error('Error in callback:', error);
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