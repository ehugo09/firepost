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
        
        // Get the opener's origin from the referrer or default to the current origin
        const openerOrigin = document.referrer 
          ? new URL(document.referrer).origin 
          : window.location.origin;
        
        console.log('Sending message to parent window at origin:', openerOrigin);
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'twitter_callback',
            code,
            state
          }, openerOrigin);
        } else {
          console.error('No parent window found');
          throw new Error('Authentication window not found');
        }
      } catch (error) {
        console.error('Error in Twitter callback:', error);
        // Try to send error to parent window if it exists
        if (window.opener) {
          const openerOrigin = document.referrer 
            ? new URL(document.referrer).origin 
            : window.location.origin;
          
          window.opener.postMessage({
            type: 'twitter_callback_error',
            error: error.message
          }, openerOrigin);
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
};

export default TwitterCallback;