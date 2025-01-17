import { TwitterAuthResponse, CALLBACK_URL } from './types.ts';

export async function handleOAuth2Request(): Promise<TwitterAuthResponse> {
  console.log('Starting OAuth 2.0 request token process');
  
  const state = crypto.randomUUID();
  const codeChallenge = crypto.randomUUID();

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: Deno.env.get("TWITTER_CLIENT_ID") || '',
    redirect_uri: CALLBACK_URL,
    scope: 'tweet.read tweet.write users.read follows.read follows.write',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'plain'
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  
  return {
    oauth_token: state,
    auth_url: authUrl
  };
}