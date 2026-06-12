const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function parseGeo(headers) {
  try {
    const raw = headers['x-nf-geo'];
    if (raw) {
      let geo;
      try { geo = JSON.parse(raw); }
      catch { geo = JSON.parse(Buffer.from(raw, 'base64').toString()); }
      return {
        country: geo.country?.code || geo.country || null,
        city: geo.city || null,
        timezone: geo.timezone || null,
      };
    }
  } catch {}
  return { country: headers['x-country'] || null, city: null, timezone: null };
}

function parseUA(ua = '') {
  const browser =
    /Edg\//.test(ua) ? 'Edge' :
    /Chrome\//.test(ua) ? 'Chrome' :
    /Firefox\//.test(ua) ? 'Firefox' :
    /Safari\//.test(ua) ? 'Safari' : 'Other';

  const os =
    /Windows/.test(ua) ? 'Windows' :
    /Android/.test(ua) ? 'Android' :
    /iPhone|iPad/.test(ua) ? 'iOS' :
    /Mac OS X/.test(ua) ? 'macOS' :
    /Linux/.test(ua) ? 'Linux' : 'Other';

  return { browser, os };
}

async function insertRow(row) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pageviews`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
}

const cors = {
  'Access-Control-Allow-Origin': 'https://rahulnayanegali.dev',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const geo = parseGeo(event.headers);
    const ua = parseUA(event.headers['user-agent']);

    await insertRow({
      path: body.path || null,
      event_type: 'pageview',
      referrer: body.referrer || null,
      screen: body.screen || null,
      language: body.language || null,
      is_new_visitor: body.isNewVisitor ?? null,
      country: geo.country,
      city: geo.city,
      timezone: geo.timezone,
      user_agent: event.headers['user-agent'] || null,
      browser: ua.browser,
      os: ua.os,
    });

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('analytics error:', err.message);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'failed' }) };
  }
};
