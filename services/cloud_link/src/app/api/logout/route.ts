import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if user wants to logout from all devices
    const url = new URL(request.url);
    const logoutAll = url.searchParams.get("all") === "true";
    
    // Get the session token from cookies
    const sessionToken = request.cookies.get('next-auth.session-token')?.value;
    
    // Call Auth service to logout
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://gateway/api/auth';
    const response = await fetch(`${authServiceUrl}/logout${logoutAll ? '?all=true' : ''}`, {
      method: 'POST',
      headers: {
        'Authorization': sessionToken ? `Bearer ${sessionToken}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Logout failed:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Logout failed' },
        { status: response.status }
      );
    }
    
    // Create response with cleared cookies
    const logoutResponse = NextResponse.json(
      { 
        success: true, 
        message: logoutAll ? 'Logged out from all devices' : 'Logged out successfully' 
      },
      { status: 200 }
    );
    
    // Clear auth cookies
    logoutResponse.cookies.delete('next-auth.session-token');
    logoutResponse.cookies.delete('next-auth.callback-url');
    logoutResponse.cookies.delete('next-auth.csrf-token');
    logoutResponse.cookies.delete('authly-sid');
    
    return logoutResponse;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during logout' },
      { status: 500 }
    );
  }
}

