import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDeviceInfo, DeviceInfo } from "@/utils/device";
import { generateToken } from "@/utils/auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

/**
 * Gets the authenticated session and user, or returns an unauthorized response
 */
export async function getAuthenticatedSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !session.token) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  
  return { session, user: session.user };
}

/**
 * Gets the current session record from the database
 */
export async function getCurrentSessionRecord(sessionToken: string) {
  return prisma.session.findFirst({
    where: { sessionToken }
  });
}

/**
 * Creates or updates a session in the database
 */

export async function upsertSession(userEmail: string, userId: string, deviceInfo: DeviceInfo, isNew: boolean) {
  const sessionToken = generateToken({ 
    email: userEmail, 
    device: deviceInfo.deviceId, 
    isNew 
  });
  
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  // Mark all other sessions as not current
  await prisma.session.updateMany({
    where: { userId, isCurrentDevice: true },
    data: { isCurrentDevice: false }
  });

  const sessionData = {
    sessionToken,
    expires: expiryDate,
    lastActive: new Date(),
    isActive: true,
    isCurrentDevice: true,
    deviceId: deviceInfo.deviceId,
    deviceName: deviceInfo.deviceName,
    deviceType: deviceInfo.deviceType,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    appVersion: deviceInfo.appVersion,
    location: deviceInfo.location,
    ipAddress: deviceInfo.ip,
  };

  // Check for existing session with same deviceId
  let dbSession = await prisma.session.findFirst({
    where: { userId, deviceId: deviceInfo.deviceId },
  });
  
  if (dbSession) {
    dbSession = await prisma.session.update({
      where: { id: dbSession.id },
      data: sessionData,
    });
  } else {
    dbSession = await prisma.session.create({
      data: {
        userId,
        ...sessionData,
      },
    });
  }
  
  return {
    sessionId: dbSession.id,
    sessionToken,
    expiryDate
  };
}

export async function updateNextAuthSession(session: Session, token: JWT) {
  if (!token?.jti) return session;

  const headersList = await headers();
  const deviceInfo = getDeviceInfo(headersList);
  
  if (token.sessionId) {
    await prisma.session.update({
      where: { id: token.sessionId as string },
      data: { 
        lastActive: new Date(),
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        appVersion: deviceInfo.appVersion,
        location: deviceInfo.location,
        ipAddress: deviceInfo.ip,
      }
    });
  }

  let expiresAt: Date;
  if (token.exp && typeof token.exp === 'number') {
    expiresAt = new Date(token.exp * 1000);
  } else {
    expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  return {
    ...session,
    user: {
      id: token.sub as string,
      name: token.name ?? null,
      email: token.email ?? null,
      image: token.picture ?? null,
      isNew: token.isNew as boolean,
    },
    token: token.jti as string,
    expires: expiresAt,
    device: deviceInfo.deviceId
  };
}

/**
 * Deletes a session by ID
 */
export async function invalidateSession(sessionId: string) {
  return prisma.session.delete({
    where: { id: sessionId }
  });
}

/**
 * Updates the lastActive timestamp for a session
 */
export async function updateSessionActivity(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { lastActive: new Date() }
  });
}



