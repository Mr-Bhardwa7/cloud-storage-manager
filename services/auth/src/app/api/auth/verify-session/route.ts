import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization token' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token using NextAuth's getToken
    const session = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    console.log("Session ===>>", session, token)
    
    if (!session || !session.email) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Find the user with all related data using the email from the session
    const user = await prisma.user.findUnique({
      where: { 
        email: session.email as string 
      },
      include: {
        onboarding: {
          include: {
            individual: true,
            company: {
              include: {
                teamMembers: true
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    let expirationDate: Date;
    if (session.exp && typeof session.exp === 'number') {
      expirationDate = new Date(session.exp * 1000);
    } else {
      expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours
    }
    
    // Return comprehensive user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        isNew: !user.onboarding?.completed,
        onboarding: user.onboarding ? {
          userType: user.onboarding.userType,
          completed: user.onboarding.completed,
          individual: user.onboarding.individual,
          company: user.onboarding.company ? {
              id: user.onboarding.company.id,
              name: user.onboarding.company.name,
              description: user.onboarding.company.description,
              website: user.onboarding.company.website,
              teamMembers: user.onboarding.company?.teamMembers || []
            } : null,
        } : null
      },
      session: {
        token: token,
        expires: expirationDate
      }
    });
    
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { message: 'Failed to verify session' },
      { status: 500 }
    );
  }
}