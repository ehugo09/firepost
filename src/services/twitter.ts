import { supabase } from "@/integrations/supabase/client";

export class TwitterService {
  static async initiateAuth(): Promise<void> {
    try {
      console.log('Starting Twitter auth flow...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('No authenticated user found');
        throw new Error('No authenticated user found');
      }

      console.log('Requesting OAuth token...');
      const { data, error } = await supabase.functions.invoke('twitter-auth', {
        body: { action: 'request_token' }
      });

      if (error) throw error;
      if (!data.oauth_token) throw new Error('No oauth_token received');

      console.log('Redirecting to Twitter auth page...');
      const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${data.oauth_token}`;
      sessionStorage.setItem('twitter_oauth_token', data.oauth_token);
      sessionStorage.setItem('user_id', session.user.id);
      
      window.location.href = authUrl;

    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      throw error;
    }
  }

  static async handleCallback(oauth_token: string, oauth_verifier: string): Promise<void> {
    try {
      console.log('Processing Twitter callback...');
      
      const storedToken = sessionStorage.getItem('twitter_oauth_token');
      if (oauth_token !== storedToken) {
        console.error('Token mismatch:', { received: oauth_token, stored: storedToken });
        throw new Error('Invalid oauth_token');
      }

      const userId = sessionStorage.getItem('user_id');
      if (!userId) {
        console.error('Missing user_id in session storage');
        throw new Error('Missing user_id');
      }

      console.log('Getting access token...');
      const { data, error } = await supabase.functions.invoke('twitter-auth', {
        body: { 
          action: 'access_token',
          oauth_token,
          oauth_verifier
        }
      });

      if (error) throw error;

      console.log('Saving connection to database...');
      const { error: dbError } = await supabase
        .from('social_connections')
        .upsert({
          user_id: userId,
          platform: 'twitter',
          access_token: data.accessToken.oauth_token,
          refresh_token: data.accessToken.oauth_token_secret,
          platform_user_id: data.userInfo.id_str,
          username: data.userInfo.screen_name,
          profile_picture: data.userInfo.profile_image_url_https,
          twitter_credentials: {
            id: data.userInfo.id_str,
            username: data.userInfo.screen_name,
            name: data.userInfo.name,
          },
        });

      if (dbError) throw dbError;

      console.log('Successfully authenticated with Twitter');
      sessionStorage.removeItem('twitter_oauth_token');
      sessionStorage.removeItem('user_id');

    } catch (error) {
      console.error('Error in callback:', error);
      throw error;
    }
  }
}