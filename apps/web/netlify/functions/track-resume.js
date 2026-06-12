const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const PDF_MAP = {
  default:   '/resume/rahulnayanegali_resume.pdf',
  extended:  '/resume/rahulnayanegali_resume_extended.pdf',
  fullstack: '/resume/fullstack/rahulnayanegali_fullstack.pdf',
  backend:   '/resume/backend/rahulnayanegali_backend.pdf',
};

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
  await fetch(`${SUPABASE_URL}/rest/v1/pageviews`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
}

export const handler = async (event) => {
  // Derive variant from request path (/resume/fullstack -> fullstack) before
  // falling back to query param, so 200-rewrites don't lose context.
  const pathVariant = (event.path || '').split('/').filter(Boolean).pop();
  const file = PDF_MAP[pathVariant] ? pathVariant : (event.queryStringParameters?.file || 'default');
  const pdfPath = PDF_MAP[file] || PDF_MAP.default;

  try {
    const rawUA = event.headers['user-agent'] || '';
    if (/HeadlessChrome|bot|crawler|spider|Googlebot|facebookexternalhit/i.test(rawUA)) {
      return { statusCode: 302, headers: { Location: pdfPath }, body: '' };
    }

    const geo = parseGeo(event.headers);
    const ua = parseUA(rawUA);

    const referrer = event.headers['referer'] || null;
    const source = referrer?.includes('rahulnayanegali.dev') ? 'portfolio_click' : 'direct';

    await insertRow({
      path: file === 'default' ? '/resume' : `/resume/${file}`,
      event_type: 'resume_download',
      referrer,
      screen: null,
      language: event.headers['accept-language']?.split(',')[0] || null,
      is_new_visitor: null,
      country: geo.country,
      city: geo.city,
      timezone: geo.timezone,
      user_agent: event.headers['user-agent'] || null,
      browser: ua.browser,
      os: ua.os,
      source,
    });
  } catch (err) {
    console.error('track-resume error:', err.message);
  }

  return {
    statusCode: 302,
    headers: { Location: pdfPath },
    body: '',
  };
};
