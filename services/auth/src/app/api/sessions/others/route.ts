import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * DELETE /api/sessions/others
 * Invalidates all other sessions except the current one
 */
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.session.deleteMany({
    where: {
      userId: session.user.id,
      sessionToken: { not: session.token },
    },
  });

  return NextResponse.json({ success: true });
}
