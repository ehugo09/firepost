import { useEffect } from 'react';

const TwitterCallback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code || !state) {
          throw new Error('Missing required OAuth parameters');
        }

        console.log('Received OAuth callback with code:', code);
        
        if (window.opener) {
          console.log('Sending message to parent window');
          window.opener.postMessage({
            type: 'twitter_callback',
            code,
            state
          }, window.location.origin);
        } else {
          console.error('No parent window found');
          throw new Error('Authentication window not found');
        }
      } catch (error) {
        console.error('Error in Twitter callback:', error);
        if (window.opener) {
          window.opener.postMessage({
            type: 'twitter_callback_error',
            error: error.message
          }, window.location.origin);
        }
      } finally {
        window.close();
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