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
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Monitor popup closure
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          console.log('OAuth popup closed');
        }
      }, 1000);

    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string): Promise<void> {
    console.log('Handling Twitter OAuth callback...');
    
    // Verify state
    const storedState = sessionStorage.getItem('twitter_oauth_state');
    if (state !== storedState) {
      console.error('State mismatch in OAuth callback');
      throw new Error('Invalid OAuth state');
    }

    // Get stored code verifier
    const codeVerifier = sessionStorage.getItem('twitter_oauth_verifier');
    if (!codeVerifier) {
      console.error('No code verifier found');
      throw new Error('Missing code verifier');
    }

    try {
      // Exchange code for tokens using Edge Function
      const { data, error } = await supabase.functions.invoke<TwitterTokenResponse>('twitter-auth', {
        body: { code, codeVerifier }
      });

      if (error) throw error;
      if (!data) throw new Error('No data received from token exchange');

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