import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface SessionData {
  id: string;
  deviceId: string | null;
  deviceName: string | null;
  deviceType: string | null;
  browser: string | null;
  location: string | null;
  ipAddress: string | null;
  lastActive: Date;
  sessionToken: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessions = await prisma.session.findMany({
    where: { userId: session.user.id },
    orderBy: { lastActive: 'desc' },
    select: {
      id: true,
      deviceId: true,
      deviceName: true,
      deviceType: true,
      browser: true,
      location: true,
      ipAddress: true,
      lastActive: true,
      sessionToken: true,
    }
  });

  return NextResponse.json(
    sessions.map((s: SessionData) => ({
      id: s.id,
      deviceId: s.deviceId,
      deviceName: s.deviceName,
      deviceType: s.deviceType,
      browser: s.browser,
      location: s.location,
      ipAddress: s.ipAddress,
      lastActive: s.lastActive,
      isCurrentDevice: s.sessionToken === session.token,
    }))
  );
}
