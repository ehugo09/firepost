import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { generateCodeVerifier, generateState } from 'https://esm.sh/pkce-gen@1.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CONSUMER_KEY')
const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CONSUMER_SECRET')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, code, codeVerifier } = await req.json()
    console.log('Received request with action:', action)

    if (action === 'connect') {
      const state = generateState()
      const newCodeVerifier = generateCodeVerifier()
      const challenge = newCodeVerifier // For Twitter, the challenge is the same as verifier

      // Get the host from the request URL
      const url = new URL(req.url)
      const redirectUri = `${url.protocol}//${url.host}/dashboard`
      console.log('Generated redirect URI:', redirectUri)

      const authUrl = new URL('https://twitter.com/i/oauth2/authorize')
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('client_id', TWITTER_CLIENT_ID!)
      authUrl.searchParams.append('redirect_uri', redirectUri)
      authUrl.searchParams.append('scope', 'tweet.read tweet.write users.read offline.access')
      authUrl.searchParams.append('state', state)
      authUrl.searchParams.append('code_challenge', challenge)
      authUrl.searchParams.append('code_challenge_method', 'plain')

      console.log('Generated auth URL:', authUrl.toString())

      return new Response(
        JSON.stringify({
          url: authUrl.toString(),
          state,
          codeVerifier: newCodeVerifier,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'callback') {
      console.log('Processing callback with code:', code)
      
      // Get the host from the request URL
      const url = new URL(req.url)
      const redirectUri = `${url.protocol}//${url.host}/dashboard`
      console.log('Using redirect URI for token exchange:', redirectUri)

      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text()
        console.error('Token exchange failed:', errorData)
        throw new Error(`Token exchange failed: ${errorData}`)
      }

      const tokens = await tokenResponse.json()
      console.log('Received tokens from Twitter')

      // Get user information
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (!userResponse.ok) {
        const errorData = await userResponse.text()
        console.error('User info fetch failed:', errorData)
        throw new Error(`Failed to fetch user info: ${errorData}`)
      }

      const userData = await userResponse.json()
      console.log('Received user data from Twitter')

      return new Response(
        JSON.stringify({
          tokens,
          user: userData.data,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid action')
  } catch (error) {
    console.error('Error in Twitter function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})