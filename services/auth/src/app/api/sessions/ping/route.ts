import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * POST /api/sessions/ping
 * Updates the lastActive timestamp for the current session
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.session.updateMany({
    where: { sessionToken: session.token },
    data: { lastActive: new Date() },
  });

  return NextResponse.json({ success: true });
}
