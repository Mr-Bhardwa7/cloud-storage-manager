import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AUTHLY_LOGIN, AUTHLY_ONBOARDING, AUTHLY_VERIFY_REQUEST, CLOUDLINK_DASHBOARD } from './constants/routes';

const PUBLIC_PATHS = ['/login',  AUTHLY_LOGIN, AUTHLY_VERIFY_REQUEST, '/token-verification', '/auth/error', '/callback', '/auth/callback'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // 1. User is not logged in
  if (!token) {
    if (!PUBLIC_PATHS.includes(pathname)) {
      const loginUrl = new URL(AUTHLY_LOGIN, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next(); // Let them visit public pages
  }

  // 2. Logged in but not onboarded
  if (token.isNew && !['/onboarding', AUTHLY_ONBOARDING].includes(pathname)) {
    return NextResponse.redirect(new URL(AUTHLY_ONBOARDING, request.url));
  }
  
  // 3. Logged in and onboarded, trying to visit login or onboarding again
  if (!token.isNew && PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL(CLOUDLINK_DASHBOARD, request.url));
  }

  // 4. Everything else is allowed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run middleware on all paths except static assets and APIs
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
