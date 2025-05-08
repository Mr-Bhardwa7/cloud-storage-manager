import { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { getDeviceInfo } from "@/utils/device";
import { generateToken } from "@/utils/auth";
import { headers } from "next/headers";
import { AUTHLY_LOGIN, AUTHLY_ERROR, AUTHLY_ONBOARDING } from "@/constants/routes";
import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";
import { upsertSession, updateNextAuthSession, invalidateSession } from "@/lib/session";
import CustomPrismaAdapter from "./customPrismaAdapter";
import { setServerCookie } from "@/utils/cookie";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isNew?: boolean;
    } & DefaultSession["user"];
    token: string;
    expires: Date;
    device: string;
  }

  interface User {
    access_token?: string;
    isNew?: boolean;
    sessionId?: string;
  }

  interface JWT {
    id?: string;
    email?: string;
    isNew?: boolean;
    access_token?: string;
    sessionId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Magic OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) throw new Error("Missing credentials");

        const magicLink = await prisma.magicLink.findFirst({
          where: { email: credentials.email, otp: credentials.otp },
        });

        if (!magicLink?.otpExpires || magicLink.otpExpires < new Date()) {
          throw new Error("OTP expired or invalid");
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { onboarding: true }
        });

        if (!user) {
          [user] = await prisma.$transaction([
            prisma.user.create({
              data: {
                email: credentials.email,
                accounts: {
                  create: {
                    provider: "credentials",
                    providerAccountId: credentials.email,
                    type: "credentials"
                  },
                },
              },
              include: {
                onboarding: true
              }
            }),
          ]);
        }

        if (user) {
           return {
            id: user.id,
            email: user.email,
            name: user.name,
            isNew: !user.onboarding?.completed,
          };
        }
      
          return null;
      },
    }),
  ],
  pages: {
    signIn: AUTHLY_LOGIN,
    error: AUTHLY_ERROR,
    newUser: AUTHLY_ONBOARDING,
  },
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) {
        console.error('No user ID found');
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { onboarding: true },
      });

      if (existingUser) {
        // Get device info for the session
        const headersList = await headers();
        const deviceInfo = getDeviceInfo(headersList);
        
        // Create or update session
        const { sessionId, sessionToken, expiryDate } = await upsertSession(
          existingUser.email!,
          existingUser.id,
          deviceInfo,
          !existingUser.onboarding?.completed
        );
        
        // Add session info to user object for JWT
        user.sessionId = sessionId;
        user.access_token = sessionToken;
        setServerCookie("authly-sid", sessionId);
        
        // Update Redux store
        store.dispatch(setUser({
          user: {
            id: existingUser.id!,
            name: existingUser.name || null,  
            email: existingUser.email,
            image: existingUser.image || null,
            isNew: !existingUser.onboarding?.completed,
          },
          token: sessionToken,
          expiresAt: expiryDate,
        }));
      }
      
      return true;
    },
    
    async jwt({ token, user, trigger }) {
      if (trigger === 'update' || (user && trigger === 'signIn')) {
        token.isNew = user.isNew;
        token.sessionId = user.sessionId;
        token.access_token = user.access_token;
        
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          include: { onboarding: true },
        });

        if (dbUser) {
          const headersList = await headers();
          const deviceInfo = getDeviceInfo(headersList);
          
          token = {
            ...token,
            jti: token.access_token || generateToken({ 
              email: dbUser.email!, 
              device: JSON.stringify(deviceInfo), 
              isNew: !dbUser.onboarding?.completed 
            }),
            sub: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            isNew: !dbUser.onboarding?.completed,
          };
        }
      }

      return token;
    },
    
    async session({ session, token }) {
      return updateNextAuthSession(session, token);
    },
    
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signOut({ token }) {
      // Mark the session as inactive when the user signs out
      if (token?.sessionId) {
        await invalidateSession(token.sessionId as string);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === "true",
};






