const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log('Twitter auth function called with method:', req.method);

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
      throw new Error(`Method ${req.method} not allowed`);
    }

    console.log('Starting Twitter auth process...');
    const { code, codeVerifier, userId } = await req.json();
    console.log('Received parameters:', { code: code?.substring(0, 10) + '...', userId });

    if (!code || !codeVerifier || !userId) {
      console.error('Missing required parameters:', { code: !!code, codeVerifier: !!codeVerifier, userId: !!userId });
      throw new Error('Missing required parameters');
    }

    console.log('Preparing token exchange request...');
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: Deno.env.get("TWITTER_CLIENT_ID") || '',
        redirect_uri: 'https://preview--pandapost.lovable.app/auth/callback/twitter',
        code_verifier: codeVerifier,
        code: code,
      }),
    });

    console.log('Token exchange response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed. Response:', errorText);
      console.error('Response headers:', Object.fromEntries(tokenResponse.headers.entries()));
      throw new Error(`Failed to exchange code for tokens: ${errorText}`);
    }

    const tokens = await tokenResponse.json();
    console.log('Successfully obtained tokens');

    console.log('Fetching user info...');
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    console.log('User info response status:', userResponse.status);

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Failed to fetch user info. Response:', errorText);
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();
    console.log('Successfully fetched user info:', userData);

    console.log('Initializing Supabase client...');
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    console.log('Upserting social connection...');
    const { error: dbError } = await supabase
      .from('social_connections')
      .upsert({
        user_id: userId,
        platform: 'twitter',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + (tokens.expires_in * 1000)).toISOString(),
        platform_user_id: userData.data.id,
        username: userData.data.username,
        twitter_credentials: {
          id: userData.data.id,
          username: userData.data.username,
          name: userData.data.name,
        },
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Successfully completed Twitter authentication process');
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in twitter-auth function:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});