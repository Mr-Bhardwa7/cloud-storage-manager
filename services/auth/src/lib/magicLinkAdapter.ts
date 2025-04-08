import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { type Adapter } from "next-auth/adapters"

export function MagicLinkAdapter(prisma: PrismaClient): Adapter {
  const baseAdapter = PrismaAdapter(prisma)

  return {
    ...baseAdapter,
    async createVerificationToken(token) {
      const magicLinkData = {
        token: token.token,
        expiresAt: token.expires,
        otp: null,
        otpExpires: null,
        used: false
      };
      await prisma.magicLink.upsert({
        where: { email: token.identifier },
        update: {...magicLinkData, updatedAt: new Date()},
        create: { email: token.identifier, ...magicLinkData }
      });
      return token
    },

    async useVerificationToken({ identifier, token }) {
      const magicLink = await prisma.magicLink.findUnique({
        where: { email: identifier, token },
        select: { email: true, token: true, expiresAt: true, used: true }
      });

      if (!magicLink || !magicLink?.expiresAt || magicLink.expiresAt < new Date() || magicLink.used) {
        return null
      }
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();      
    
      await prisma.magicLink.update({
        where: { email: magicLink.email },
        data: {
          otp,
          otpExpires: new Date(Date.now() + 5 * 60 * 1000),
          used: true
        }
      });

      return {
        identifier,
        otp,
        token: magicLink.token,
        expires: magicLink.expiresAt,
      }
    },
  }
}
