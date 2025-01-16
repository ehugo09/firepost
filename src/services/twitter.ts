import { supabase } from "@/integrations/supabase/client";
import { getTwitterAuthUrl } from "@/utils/twitter/oauth";

interface TwitterTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Initiating Twitter OAuth flow...');
      const authUrl = await getTwitterAuthUrl();
      console.log('Generated Twitter auth URL:', authUrl);
      
      // Open popup window
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'Twitter Auth',
        `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`
      );

      if (!popup) {
        console.error('Popup was blocked by the browser');
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      console.log('OAuth popup opened successfully');

      // Monitor popup closure
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          console.log('OAuth popup closed by user');
        }
      }, 1000);

    } catch (error) {
      console.error('Error in initiateAuth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string): Promise<void> {
    console.log('Starting Twitter OAuth callback handling...');
    console.log('Received code:', code);
    console.log('Received state:', state);
    
    // Verify state
    const storedState = sessionStorage.getItem('twitter_oauth_state');
    console.log('Stored state:', storedState);
    
    if (state !== storedState) {
      console.error('State mismatch. Received:', state, 'Stored:', storedState);
      throw new Error('Invalid OAuth state');
    }

    // Get stored code verifier
    const codeVerifier = sessionStorage.getItem('twitter_oauth_verifier');
    if (!codeVerifier) {
      console.error('No code verifier found in session storage');
      throw new Error('Missing code verifier');
    }

    try {
      console.log('Exchanging code for tokens...');
      // Exchange code for tokens using Edge Function
      const { data, error } = await supabase.functions.invoke<TwitterTokenResponse>('twitter-auth', {
        body: { code, codeVerifier }
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw error;
      }
      if (!data) {
        console.error('No data received from token exchange');
        throw new Error('No data received from token exchange');
      }

      console.log('Successfully exchanged code for tokens');
      
      // Clean up session storage
      sessionStorage.removeItem('twitter_oauth_state');
      sessionStorage.removeItem('twitter_oauth_verifier');

    } catch (error) {
      console.error('Error handling Twitter callback:', error);
      throw error;
    }
  }
}