import { supabase } from "@/integrations/supabase/client";

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Starting Twitter auth flow via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('twitter-auth-flow');
      
      if (error) throw error;
      if (!data?.url) throw new Error('No auth URL received');

      // Store PKCE values
      sessionStorage.setItem('twitter_oauth_state', data.state);
      sessionStorage.setItem('twitter_oauth_verifier', data.codeVerifier);
      
      console.log('Redirecting to Twitter auth page...');
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string): Promise<void> {
    try {
      console.log('Processing Twitter callback...');
      
      // Verify state
      const storedState = sessionStorage.getItem('twitter_oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Get code verifier
      const codeVerifier = sessionStorage.getItem('twitter_oauth_verifier');
      if (!codeVerifier) {
        throw new Error('Missing code verifier');
      }

      console.log('Exchanging code for tokens...');
      const { data, error } = await supabase.functions.invoke('twitter-auth', {
        body: { 
          code,
          codeVerifier,
          redirectUri: 'https://preview--pandapost.lovable.app/auth/callback/twitter'
        }
      });

      if (error) throw error;
      if (!data) throw new Error('No data received from token exchange');

      // Clean up
      sessionStorage.removeItem('twitter_oauth_state');
      sessionStorage.removeItem('twitter_oauth_verifier');

      console.log('Twitter authentication completed successfully');
      
    } catch (error) {
      console.error('Error in callback:', error);
      throw error;
    }
  }
}