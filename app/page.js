'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState({
    tasks: {},
    projects: {},
    grocery: {},
    keyTimes: []
  });
  const [weather, setWeather] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [gmail, setGmail] = useState([]);
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = useState('home');

  useEffect(() => {
    loadData();
    fetchWeather();
    checkGoogleAuth();
  }, []);

  const loadData = () => {
    const cached = localStorage.getItem('fmd-cache');
    if (cached) {
      setData(JSON.parse(cached));
    } else {
      loadSeedData();
    }
  };

  const loadSeedData = () => {
    const seedData = {
      tasks: {
        't1': { id: 't1', title: 'Kids buy pumpkins', category: 'kids', status: 'done', date: '2026-10-04' },
        't2': { id: 't2', title: 'Bath & sleep', category: 'kids', status: 'done', time: '7:00 PM', date: '2026-10-04' },
        't3': { id: 't3', title: 'School pick up', category: 'kids', status: 'done', date: '2026-10-04' },
        't4': { id: 't4', title: 'Arabic Quran game', category: 'kids', status: 'done', time: '6:30 PM', date: '2026-10-04' },
        't5': { id: 't5', title: 'Numberblocks', category: 'kids', status: 'done', time: '6:15 PM', date: '2026-10-04' }
      },
      projects: {
        'p1': { id: 'p1', name: 'Islamic Explorer (Lovable)', category: 'self', status: 'active' },
        'p2': { id: 'p2', name: 'World Mastery Game', category: 'self', status: 'active' },
        'p3': { id: 'p3', name: 'Cooking Game with Teta', category: 'self', status: 'active' },
        'p4': { id: 'p4', name: 'Apple Picking Outing', category: 'self', status: 'active' },
        'p5': { id: 'p5', name: 'Baby Clothes Quilt', category: 'self', status: 'active' },
        'p6': { id: 'p6', name: 'Dashboard Brain Dump', category: 'self', status: 'active' },
        'p7': { id: 'p7', name: 'Summer 2026 Picture Book', category: 'self', status: 'active' }
      },
      grocery: {
        'g1': { id: 'g1', title: 'Stone field yogurt pouches', store: 'Costco', checked: false },
        'g2': { id: 'g2', title: 'Yogurt pouches', store: 'Costco', checked: false },
        'g3': { id: 'g3', title: 'Strawberries', store: 'Costco', checked: false },
        'g4': { id: 'g4', title: 'Ground beef', store: 'Costco', checked: false },
        'g5': { id: 'g5', title: 'Item 5', store: 'Costco', checked: false },
        'g6': { id: 'g6', title: 'Item 6', store: 'Costco', checked: false }
      },
      keyTimes: [
        'Yousef nap: max 90 min',
        'Leave for pickup: 2:30 PM',
        'School pickup: 3:00 PM',
        'Arabic Quran game: 6:30 PM',
        'Bath & bedtime: 7:00 PM'
      ]
    };
    setData(seedData);
    localStorage.setItem('fmd-cache', JSON.stringify(seedData));
  };

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (e) {
      console.error('Weather error:', e);
    }
  };

  const checkGoogleAuth = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'true') {
      setConnected(true);
      fetchCalendar();
      fetchGmail();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const fetchCalendar = async () => {
    try {
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const events = await res.json();
        setCalendar(events);
      }
    } catch (e) {
      console.error('Calendar error:', e);
    }
  };

  const fetchGmail = async () => {
    try {
      const res = await fetch('/api/gmail');
      if (res.ok) {
        const emails = await res.json();
        setGmail(emails);
      }
    } catch (e) {
      console.error('Gmail error:', e);
    }
  };

  const connectGoogle = () => {
    window.location.href = '/api/auth/google/login';
  };

  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem('fmd-cache', JSON.stringify(newData));
  };

  const toggleTask = (id) => {
    const newData = { ...data };
    if (newData.tasks[id]) {
      newData.tasks[id].status = newData.tasks[id].status === 'done' ? 'todo' : 'done';
      saveData(newData);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '16px', fontFamily: 'system-ui', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ margin: '0 0 24px 0' }}>Farah</h1>
      
      {weather && (
        <div style={{ background: '#667eea', color: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>{weather.temperature}°F • {weather.condition}</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '12px', overflowX: 'auto' }}>
        <button onClick={() => setTab('home')} style={{ background: tab === 'home' ? '#667eea' : '#fff', color: tab === 'home' ? 'white' : '#333', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>HOME</button>
        <button onClick={() => setTab('schedule')} style={{ background: tab === 'schedule' ? '#667eea' : '#fff', color: tab === 'schedule' ? 'white' : '#333', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>📅 CALENDAR</button>
        <button onClick={() => setTab('email')} style={{ background: tab === 'email' ? '#667eea' : '#fff', color: tab === 'email' ? 'white' : '#333', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>✉️ EMAIL</button>
        <button onClick={() => setTab('projects')} style={{ background: tab === 'projects' ? '#667eea' : '#fff', color: tab === 'projects' ? 'white' : '#333', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>🎯 PROJECTS</button>
        <button onClick={() => setTab('grocery')} style={{ background: tab === 'grocery' ? '#667eea' : '#fff', color: tab === 'grocery' ? 'white' : '#333', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>🛒 GROCERY</button>
      </div>

      {tab === 'home' && (
        <>
          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <h2 style={{ marginTop: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#333' }}>📋 Today</h2>
            {Object.values(data.tasks).map(t => (
              <div key={t.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <input 
                  type="checkbox" 
                  checked={t.status === 'done'} 
                  onChange={() => toggleTask(t.id)}
                  style={{ marginTop: '4px', cursor: 'pointer' }}
                />
                <span style={{ opacity: t.status === 'done' ? 0.5 : 1, textDecoration: t.status === 'done' ? 'line-through' : 'none', flex: 1, fontSize: '14px' }}>
                  {t.title} {t.time && <span style={{ color: '#666', fontSize: '12px' }}>({t.time})</span>}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <h2 style={{ marginTop: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#333' }}>⏱️ Key Times</h2>
            {data.keyTimes.map((kt, i) => (
              <div key={i} style={{ padding: '8px 0', fontSize: '13px', borderBottom: '1px solid #eee' }}>
                {kt}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'schedule' && (
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ marginTop: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#333' }}>📅 Google Calendar {connected && '✓'}</h2>
          {!connected ? (
            <button onClick={connectGoogle} style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Connect Google Calendar
            </button>
          ) : calendar.length > 0 ? (
            calendar.map((event, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: '600', fontSize: '13px' }}>{event.summary}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(event.start.dateTime || event.start.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '13px', color: '#666' }}>No upcoming events</div>
          )}
        </div>
      )}

      {tab === 'email' && (
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ marginTop: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#333' }}>✉️ Gmail {connected && '✓'}</h2>
          {!connected ? (
            <button onClick={connectGoogle} style={{ background: '#667eea', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Connect Gmail
            </button>
          ) : gmail.length > 0 ? (
            gmail.map(email => (
              <div key={email.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: '600', fontSize: '13px' }}>{email.subject}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{email.from}</div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '13px', color: '#666' }}>No emails</div>
          )}
        </div>
      )}

      {tab === 'projects' && (
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ marginTop: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#333' }}>🎯 Projects</h2>
          {Object.values(data.projects).map(p => (
            <div key={p.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee', fontSize: '13px' }}>✓ {p.name}</div>
          ))}
        </div>
      )}

      {tab === 'grocery' && (
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ marginTop: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#333' }}>🛒 Costco</h2>
          {Object.values(data.grocery).map(g => (
            <div key={g.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                checked={g.checked} 
                onChange={() => {
                  const newData = { ...data };
                  newData.grocery[g.id].checked = !newData.grocery[g.id].checked;
                  saveData(newData);
                }}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ opacity: g.checked ? 0.5 : 1, textDecoration: g.checked ? 'line-through' : 'none', fontSize: '13px', flex: 1 }}>
                {g.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
