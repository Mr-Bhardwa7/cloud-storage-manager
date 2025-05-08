import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_LOGIN_URL = '/auth/login';
const BASE_PATH = '/account';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/_next') || 
      pathname.includes('/favicon.ico') ||
      pathname.includes('.svg') ||
      pathname.includes('.png') ||
      pathname.includes('.jpg')) {
    return NextResponse.next();
  }
  
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;
  const authlySID = request.cookies.get('authly-sid')?.value;
  
  if (!sessionToken || !authlySID) {
    const loginUrl = new URL(AUTH_LOGIN_URL, request.url);
    
    const callbackPath = pathname.startsWith(BASE_PATH) 
      ? pathname 
      : `${BASE_PATH}${pathname}`;
      
    loginUrl.searchParams.set('callbackUrl', callbackPath);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
