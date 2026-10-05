export async function GET(request) {
  const accessToken = request.cookies.get('google_access_token')?.value;
  
  if (!accessToken) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    const listRes = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    if (!listRes.ok) {
      return Response.json({ error: 'Gmail API error' }, { status: listRes.status });
    }
    
    const listData = await listRes.json();
    const messages = listData.messages || [];
    
    const emailDetails = await Promise.all(
      messages.map(async (msg) => {
        const detailRes = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        const detail = await detailRes.json();
        
        const headers = detail.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
        
        return { id: msg.id, subject, from };
      })
    );
    
    return Response.json(emailDetails);
  } catch (error) {
    console.error('Gmail error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
