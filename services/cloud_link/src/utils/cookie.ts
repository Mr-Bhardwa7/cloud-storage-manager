interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

// Client-side cookie utilities
export const setClientCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
) => {
  const defaultOptions: CookieOptions = {
    path: '/',
    secure: true,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };

  const cookieOptions = { ...defaultOptions, ...options };
  const cookieString = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    cookieOptions.path && `path=${cookieOptions.path}`,
    cookieOptions.domain && `domain=${cookieOptions.domain}`,
    cookieOptions.maxAge && `max-age=${cookieOptions.maxAge}`,
    cookieOptions.expires && `expires=${cookieOptions.expires.toUTCString()}`,
    cookieOptions.secure && 'secure',
    cookieOptions.sameSite && `samesite=${cookieOptions.sameSite.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join('; ');

  if (typeof document !== 'undefined') {
    document.cookie = cookieString;
  }
};

export const getClientCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  return null;
};

export const deleteClientCookie = (name: string) => {
  setClientCookie(name, '', { maxAge: -1 });
};