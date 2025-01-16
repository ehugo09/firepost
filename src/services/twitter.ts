import { supabase } from "@/integrations/supabase/client";
import * as oauth from "oauth4webapi";

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Starting Twitter auth flow with oauth4webapi...');
      
      // Create OAuth issuer and authorization server info
      const as = {
        issuer: 'https://twitter.com',
        authorization_endpoint: 'https://twitter.com/i/oauth2/authorize',
        token_endpoint: 'https://api.twitter.com/2/oauth2/token'
      };

      // Generate PKCE values
      const code_verifier = oauth.generateRandomCodeVerifier();
      const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
      
      // Store PKCE values securely
      sessionStorage.setItem('twitter_oauth_verifier', code_verifier);
      
      // Generate state
      const state = oauth.generateRandomState();
      sessionStorage.setItem('twitter_oauth_state', state);

      // Client configuration
      const client: oauth.Client = {
        client_id: 'akNKemhMMnZBdlJTYzliRjRtd1o6MTpjaQ',
        token_endpoint_auth_method: 'none'
      };

      // Authorization request parameters
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: client.client_id,
        redirect_uri: 'https://preview--pandapost.lovable.app/auth/callback/twitter',
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: code_challenge,
        code_challenge_method: 'S256',
        force_login: 'true'
      });

      const fullUrl = `${as.authorization_endpoint}?${params.toString()}`;
      console.log('Redirecting to Twitter auth URL:', fullUrl);
      window.location.href = fullUrl;
      
    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string): Promise<void> {
    try {
      console.log('Processing Twitter callback with oauth4webapi...');
      
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

      console.log('Exchanging code for tokens via Edge Function...');
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