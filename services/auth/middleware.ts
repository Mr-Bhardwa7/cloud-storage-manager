import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Force immediate console output
    console.log('\n[Middleware Start]', new Date().toISOString());
    console.log(`Path: ${pathname}`, { immediate: true });
    console.log('Method:', request.method, { immediate: true });

    // Test specific routes
    if (pathname.startsWith('/api/auth')) {
        console.log('Auth route detected!', { immediate: true });
    }

    // Add response headers to verify middleware execution
    const response = NextResponse.next();
    response.headers.set('x-middleware-active', 'true');

    console.log('[Middleware End]\n', { immediate: true });
    return response;
}
 
// Simplified matcher to ensure middleware runs
export const config = {
  matcher: [
    '/:path*',
    '/api/:path*'
  ],
}