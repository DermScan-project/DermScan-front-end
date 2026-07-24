const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

function getTokens() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('dermscan_tokens');
  return raw ? (JSON.parse(raw) as { accessToken: string; refreshToken: string; role: string }) : null;
}

function setTokens(tokens: { accessToken: string; refreshToken: string; role: string }) {
  localStorage.setItem('dermscan_tokens', JSON.stringify(tokens));
}

function clearTokens() {
  localStorage.removeItem('dermscan_tokens');
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens) return null;

  const roleSegment = tokens.role; // 'patient' | 'medecin' (admin has no refresh endpoint stored client-side the same way)
  const res = await fetch(`${API_URL}/api/${roleSegment}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = await res.json();
  setTokens({ ...tokens, accessToken: data.accessToken });
  return data.accessToken;
}

export async function apiFetch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, headers, ...rest } = options;
  const tokens = getTokens();

  const doFetch = async (accessToken?: string) => {
    return fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        ...(!(rest.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken && !skipAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });
  };

  let res = await doFetch(tokens?.accessToken);

  if (res.status === 401 && !skipAuth && tokens) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      res = await doFetch(newAccessToken);
    }
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw { status: res.status, ...(data || {}) };
  }

  return data as T;
}

export { getTokens, setTokens, clearTokens };