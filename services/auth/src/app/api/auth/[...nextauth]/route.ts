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

  interface User {
    access_token?: string;
    isNew?: boolean;
  }

  interface JWT {
    id?: string;
    email?: string;
    isNew?: boolean;
    access_token?: string;
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

        
        // if (existingUser && account && account?.provider !== "credentials") {
        //     const headersList = await headers();
        //     const device = JSON.stringify(getDeviceInfo(headersList));
        //     const sessionToken = generateToken({ email: user.email!, device });
        //     const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        //     const sessionData = {
        //         sessionToken: sessionToken,
        //         device,
        //         expires: sessionExpiry, // 7 days
        //     };
          
        //     await prisma.session.create({
        //         data: {
        //             ...sessionData,
        //             userId: existingUser?.id,
        //         }
        //     });
        // }

      if (existingUser) {
          store.dispatch(setUser({
            user: {
              id: existingUser.id!,
              name: existingUser.name || null,  
              email: existingUser.email,
              image: existingUser.image || null,
              isNew: !existingUser.onboarding?.completed,
            },
            token: account?.access_token || user.access_token ||"",
            expiresAt: new Date(account?.expires_at || Date.now() + 7 * 24 * 60 * 60 * 1000),
          }));
        }
        
      return true;
    },
    async jwt({ token, user, trigger }) {
      console.log("Token ===>>", token)
        if (trigger === 'update' || (user && trigger === 'signIn')) {
          token.isNew = user.isNew;
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email! },
            include: { onboarding: true },
          });

          if (dbUser) {
            const headersList = await headers();
            const device = JSON.stringify(getDeviceInfo(headersList));
            const sessionToken = generateToken({ email: dbUser.email!, device, isNew: !dbUser.onboarding?.completed  });

            token = {
              ...token,
              jti: sessionToken,
              sub: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              isNew: !dbUser.onboarding?.completed,
              access_token : user.access_token || token.access_token,
            };
          }
        }

      return token;
    },
    async session({ session, token }) {
      if (!token?.jti) return session;

      const headersList = await headers();
      const device = JSON.stringify(getDeviceInfo(headersList));
      const accessToken = generateToken({ 
        id: token.sub as string,
        email: token.email as string,
        device 
      });

      session = {
        ...session,
        user: {
          id: token.sub as string,
          name: token.name ?? null,
          email: token.email ?? null,
          image: token.picture ?? null,
          isNew: token.isNew as boolean,
        },
        token: accessToken,
        device
      };

      return session;
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
