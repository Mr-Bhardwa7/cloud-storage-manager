import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getDeviceInfo } from "@/utils/device";
import { generateToken } from "@/utils/auth";
import { headers } from "next/headers";
import { AUTHLY_LOGIN, AUTHLY_ERROR, AUTHLY_ONBOARDING } from "@/constants/routes";
import { setServerCookie } from "@/utils/cookie";
import { v4 as uuidv4 } from "uuid";
import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";

declare module "next-auth" {
  interface Session {
    user: {
        id: string;
        isNew?: boolean;
    } & DefaultSession["user"];
    token: string;
    expiresAt: Date;
    device: string;
  }
}

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
        });

        const headersList = await headers();
        const device = JSON.stringify(getDeviceInfo(headersList));
        const sessionToken = generateToken({ id: uuidv4(), email: credentials.email, isNew: true, device });

        const sessionData = {
          sessionToken,
          device,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };

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
                sessions: {
                  create: sessionData,
                },
              },
            }),
          ]);
        } else {
          await prisma.session.create({
            data: {
              ...sessionData,
              userId: user.id,
            },
          });
        }

        await setServerCookie('next-auth.session-token', sessionToken, {
            maxAge: 60 * 5,
            httpOnly: true,
            secure: true
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isNew: true,
        };
      },
    }),
  ],
  pages: {
    signIn: AUTHLY_LOGIN,
    error: AUTHLY_ERROR,
    newUser: AUTHLY_ONBOARDING,
  },
  session: { strategy: "database", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { onboarding: true },
        });

        if (dbUser) {
          const headersList = await headers();
          const device = JSON.stringify(getDeviceInfo(headersList));

          const existingSession = await prisma.session.findFirst({
            where: {
              userId: dbUser.id,
              device,
              expires: { gt: new Date() },
            },
            orderBy: { expires: "desc" },
          });

            token = {
              ...token,
              jti: existingSession?.sessionToken ?? generateToken({ email: user.email, device }),
              sub: dbUser.id,
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              isNew: !dbUser.onboarding?.completed,
            };
        }
      }

      return token;
    },
    async session({ session, token }) {
        if (!token?.jti) return session;
        
        session.user = {
            id: token.id as string,
            name: token.name ?? null,
            email: token.email ?? null,
            isNew: token.isNew as boolean,
        };
        
        if (token.jti) {
            const sessionDb = await prisma.session.findUnique({
                where: { sessionToken: token.jti as string },
            });

            if (sessionDb) {
                session.token = sessionDb.sessionToken;
                session.expiresAt = sessionDb.expires;
                session.device = sessionDb.device ?? "unknown";
            }
        }

        return session;
    },
      async signIn({ user, profile, account }) {
        console.log("PROFILE ===>>", profile)
        console.log("ACCOUNT ===>>", account)
        console.log("user ===>>", user)
         if (!user?.id) {
            console.error('No user ID found');
            return false;
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { onboarding: true },
        });

        
          if (existingUser && account?.provider !== "credentials") {
            const headersList = await headers();
            const device = JSON.stringify(getDeviceInfo(headersList));
            const sessionToken = generateToken({ email: user.email!, device });
            const sessionData = {
                sessionToken: sessionToken,
                device,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            };
            
            await prisma.session.create({
                data: {
                    ...sessionData,
                    userId: existingUser?.id,
                }
            });
        }

        if(existingUser) {
          store.dispatch(setUser({
            user: {
              id: existingUser.id!,
              name: existingUser.name || null,  
              email: existingUser.email,
              image: existingUser.image || null,
              isNew: !existingUser.onboarding?.completed,
            },
            token: account?.access_token || "",
            expiresAt: new Date(account?.expires_at || Date.now() + 7 * 24 * 60 * 60 * 1000),
          }));
        }

        // ✅ Optional: Check onboarding only if user exists
        if (existingUser && !existingUser.onboarding?.completed)  return AUTHLY_ONBOARDING;
        return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === "true",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
