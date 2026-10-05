export async function GET(request) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');
  
  if (error) return Response.redirect(`${process.env.NEXTAUTH_URL}?error=${error}`);
  if (!code) return Response.redirect(`${process.env.NEXTAUTH_URL}?error=no_code`);
  
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
      })
    });
    
    const tokens = await tokenResponse.json();
    
    if (!tokens.access_token) {
      return Response.redirect(`${process.env.NEXTAUTH_URL}?error=no_token`);
    }
    
    const response = Response.redirect(`${process.env.NEXTAUTH_URL}?connected=true`);
    response.cookies.set('google_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in
    });
    
    if (tokens.refresh_token) {
      response.cookies.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    return response;
  } catch (error) {
    console.error('OAuth error:', error);
    return Response.redirect(`${process.env.NEXTAUTH_URL}?error=server_error`);
  }
}
