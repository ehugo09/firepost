import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TwitterCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        if (!code || !state) {
          console.error('Missing code or state in callback');
          toast.error('Authentication failed: Missing parameters');
          navigate('/dashboard');
          return;
        }

        // We'll implement the token exchange here in the next step
        console.log('Received authorization code:', code);
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error handling Twitter callback:', error);
        toast.error('Failed to complete authentication');
        navigate('/dashboard');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default TwitterCallback;