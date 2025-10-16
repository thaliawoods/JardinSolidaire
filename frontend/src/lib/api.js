const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

function ensureLeadingSlash(p = '') {
  return p.startsWith('/') ? p : `/${p}`;
}

function qs(obj = {}) {
  const sp = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach((item) => sp.append(k, String(item)));
    else sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export async function apiFetch(
  path,
  {
    method = 'GET',
    body,
    headers = {},
    query,             
    signal,            
    raw = false,        
  } = {}
) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const url = `${API_BASE}${ensureLeadingSlash(path)}${qs(query)}`;

  const res = await fetch(url, {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    signal,
  });

  if (raw) return res; 

  const contentType = res.headers.get('content-type') || '';
  const canJson = contentType.includes('application/json');
  const parse = async () => {
    if (res.status === 204) return null;
    if (!canJson) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const data = await parse();

  if (!res.ok) {
    const err = {
      status: res.status,
      error: (data && (data.error || data.message)) || `HTTP_${res.status}`,
      details: data || null,
    };
    throw err;
  }

  return data;
}
