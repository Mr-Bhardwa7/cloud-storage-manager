import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract token from next-auth.session-token cookie
    const sessionToken = request.cookies.get('next-auth.session-token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session token found in cookies' },
        { status: 401 }
      );
    }
    
    // Call Auth service to verify the session
    const response = await fetch('http://gateway/api/auth/verify-session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Session verification failed' },
        { status: response.status }
      );
    }
    
    // Return the session data from Auth service
    const sessionData = await response.json();
    return NextResponse.json(sessionData);
    
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
