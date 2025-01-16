import { supabase } from "@/integrations/supabase/client";

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Starting Twitter OAuth 1.0a flow...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('No authenticated user found');
        throw new Error('No authenticated user found');
      }

      console.log('Requesting OAuth token from Edge Function...');
      const { data, error } = await supabase.functions.invoke('twitter-auth', {
        body: { action: 'request_token' }
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw error;
      }
      
      if (!data.oauth_token) {
        console.error('No oauth_token received:', data);
        throw new Error('No oauth_token received');
      }

      console.log('Redirecting to Twitter auth page with token:', data.oauth_token);
      window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${data.oauth_token}&force_login=true`;

    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      throw error;
    }
  }

  static async handleCallback(oauth_token: string, oauth_verifier: string): Promise<void> {
    try {
      console.log('Processing Twitter callback with tokens:', { oauth_token, oauth_verifier });
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('No authenticated user found');
        throw new Error('No authenticated user found');
      }

      console.log('Getting access token from Edge Function...');
      const { data, error } = await supabase.functions.invoke('twitter-auth', {
        body: { 
          action: 'access_token',
          oauth_token,
          oauth_verifier,
          user_id: session.user.id
        }
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw error;
      }

      console.log('Successfully authenticated with Twitter');

    } catch (error) {
      console.error('Error in callback:', error);
      throw error;
    }
  }
}