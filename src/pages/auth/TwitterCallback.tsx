import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TwitterCallback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code || !state) {
          throw new Error('Missing required OAuth parameters');
        }

        console.log('Received OAuth callback with code:', code);
        
        // Send message to parent window
        if (window.opener) {
          console.log('Sending message to parent window');
          window.opener.postMessage({
            type: 'twitter_callback',
            code,
            state
          }, window.location.origin);
          window.close();
        } else {
          console.error('No parent window found');
          throw new Error('Authentication window not found');
        }
      } catch (error) {
        console.error('Error handling Twitter callback:', error);
        if (window.opener) {
          window.opener.postMessage({
            type: 'twitter_callback_error',
            error: error.message
          }, window.location.origin);
          window.close();
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default TwitterCallback;