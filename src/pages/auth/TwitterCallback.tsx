import { useEffect } from 'react';

const TwitterCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    console.log("Processing callback with params:", { code, state });

    if (!code || !state) {
      console.error("Missing required OAuth parameters");
      window.opener?.postMessage(
        { type: 'twitter_callback_error', error: 'Missing OAuth parameters' },
        window.location.origin
      );
      return;
    }

    // Send the code back to the opener window
    if (window.opener) {
      console.log("Sending callback data to opener");
      window.opener.postMessage(
        { type: 'twitter_callback', code, state },
        window.location.origin
      );
    } else {
      console.error("No opener window found");
    }
  }, []);

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