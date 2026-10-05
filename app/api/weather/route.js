export async function GET() {
  try {
    const lat = 43.1629, lng = -92.5159;
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code`);
    const data = await res.json();
    const temp = data.current.temperature_2m;
    const code = data.current.weather_code;
    
    const conditions = {
      0: 'Clear',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Drizzle',
      53: 'Drizzle',
      55: 'Heavy drizzle',
      61: 'Rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Snow',
      73: 'Snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Rain showers',
      81: 'Rain showers',
      82: 'Violent rain',
      85: 'Snow showers',
      86: 'Snow showers',
      95: 'Thunderstorm'
    };
    
    return Response.json({
      temperature: Math.round(temp),
      condition: conditions[code] || 'Unknown',
      location: 'Rochester, MN'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
