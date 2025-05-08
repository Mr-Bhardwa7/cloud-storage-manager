import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('next-auth.session-token')?.value;
    const authlySID = request.cookies.get('authly-sid')?.value;

    if (!sessionToken || !authlySID) {
      return NextResponse.json(
        { error: 'No session token found in cookies' },
        { status: 401 }
      );
    }

    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://gateway/api';

    // Step 1: Verify session using Auth microservice
    let verifyResponse: Response;
    try {
      verifyResponse = await fetch(`${authServiceUrl}/sessions/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
          'User-Agent': request.headers.get('User-Agent') || '',
          'X-Forwarded-For':
            request.headers.get('X-Forwarded-For') ||
            request.headers.get('x-real-ip') ||
            '',
          'X-Real-IP': request.headers.get('X-Real-IP') || '',
          'X-Authly-SID': authlySID || '',
        },
      });
    } catch (fetchError) {
      console.error('Failed to connect to auth service:', fetchError);
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    // Always read response body only once
    const responseText = await verifyResponse.text();

    if (!verifyResponse.ok) {
      let errorMessage = 'Session verification failed';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        if (responseText) {
          errorMessage = responseText.substring(0, 100); // Safe length
        }
      }

      console.error('Failed to verify session:', errorMessage)
      return NextResponse.json(
        { error: errorMessage },
        { status: verifyResponse.status }
      );
    }

    let sessionData;
    try {
      if (!responseText) {
        throw new Error('Empty response');
      }
      sessionData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse session data:', parseError);
      return NextResponse.json(
        { error: 'Invalid response from authentication service' },
        { status: 500 }
      );
    }

    // Step 2: Fetch extended user profile if onboarding missing
    if (sessionData.user && !sessionData.user.onboarding) {
      try {
        const profileRes = await fetch(`${authServiceUrl}/user`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: sessionData.user.email }),
        });

        if (profileRes.ok) {
          const userData = await profileRes.json();
          sessionData.user = {
            ...sessionData.user,
            onboarding: userData.onboarding || null,
            isNew: !userData.onboarding?.completed,
          };
        }
      } catch (profileErr) {
        console.warn('Failed to fetch user profile:', profileErr);
      }
    }

    // Step 3: Update session activity (non-blocking)
    fetch(`${authServiceUrl}/sessions/ping`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    }).catch((err) => console.warn('Session ping failed:', err));

    return NextResponse.json(sessionData);
  } catch (err) {
    console.error('Session API error:', err);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
