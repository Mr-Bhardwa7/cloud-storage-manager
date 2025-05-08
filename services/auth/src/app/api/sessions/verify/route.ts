// auth/app/api/sessions/verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader } from '@/utils/device';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req);
    const authlySID = req.headers.get('X-Authly-SID');

    if (!token || !authlySID) {
      return NextResponse.json(
        { message: 'Missing or invalid Authorization token' },
        { status: 401 }
      );
    }

    console.log("TOKEN: ", token);

    const session = await prisma.session.findUnique({
      where: { id: authlySID },
      include: { 
        user: {
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
        } 
      },
    });

    console.log("SESSION: ", session);
    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { message: 'Session invalid or expired' },
        { status: 401 }
      );
    }
    // Update lastActive timestamp
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActive: new Date() }
    });

    return NextResponse.json({
      id: session.id,
      token: session.sessionToken,
      expiresAt: session.expires,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        isNew: !session.user.onboarding?.completed,
        onboarding: session.user.onboarding ? {
          userType: session.user.onboarding.userType,
          completed: session.user.onboarding.completed,
          individual: session.user.onboarding.individual,
          company: session.user.onboarding.company ? {
            id: session.user.onboarding.company.id,
            name: session.user.onboarding.company.name,
            description: session.user.onboarding.company.description,
            website: session.user.onboarding.company.website,
            teamMembers: session.user.onboarding.company?.teamMembers || []
          } : null,
        } : null
      }
    });

  } catch (err) {
    console.error('Session verification failed:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
