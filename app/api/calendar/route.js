export async function GET(request) {
  const accessToken = request.cookies.get('google_access_token')?.value;
  
  if (!accessToken) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    if (!res.ok) {
      return Response.json({ error: 'Calendar API error' }, { status: res.status });
    }
    
    const data = await res.json();
    return Response.json(data.items || []);
  } catch (error) {
    console.error('Calendar error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
