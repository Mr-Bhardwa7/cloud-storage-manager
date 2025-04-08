// import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import { Provider } from "@prisma/client";
// import { prisma } from "@/lib/prisma";
// import { generateToken } from "@/utils/auth";
// import { getDeviceInfo } from "@/utils/device";
// import { headers } from 'next/headers';
// import { getServerCookie, setServerCookie } from "@/utils/cookie";
// import { AUTHLY_LOGIN, AUTHLY_ONBOARDING, AUTHLY_ERROR, CLOUDLINK_DASHBOARD } from "@/constants/routes"

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//     } & DefaultSession["user"];
//     token: string;
//     expiresAt: Date;
//     device: string;
//   }
// }

// const cookieOption = {
//   maxAge: 60 * 5,
//   httpOnly: true,
//   secure: true
// };

// const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),
//   ],
//   session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
//   callbacks: {
//      async session({ session, token }) {
//       const tokenId = token.jti as string; 

//       if (!tokenId) return session;

//       const existingSession = await prisma.session.findUnique({
//         where: { token: tokenId },
//       });

//       if (!existingSession) return session;

//       if (new Date(existingSession.expiresAt) < new Date()) {
//         console.log("Session expired for token:", tokenId);
//         return session;
//       }

//       return {
//         ...session,
//         token: existingSession.token,
//         expiresAt: existingSession.expiresAt,
//         device: existingSession.device,
//       };
//     },
//     async signIn({ account, profile }) {
//       console.log("User Profile:", profile);
//       if (!profile?.email) return false;

//       try {
//         const existingUser = await prisma.user.findUnique({
//           where: { email: profile.email },
//           include: { onboarding: true }
//         });
//         const redirectPath = existingUser?.onboarding?.completed ? CLOUDLINK_DASHBOARD : AUTHLY_ONBOARDING;
//         await setServerCookie('redirect_url', redirectPath, cookieOption);
        
//         const provider = account?.provider?.toUpperCase() as Provider;
//         const providerUserId = account?.providerAccountId ?? "";

//         const user = await prisma.user.upsert({
//           where: { email: profile.email },
//           create: {
//             email: profile.email,
//             name: profile.name ?? null,
//             avatarUrl: profile.image ?? null,
//             accounts: {
//               create: {
//                 provider,
//                 providerUserId,
//                 accessToken: account?.access_token ?? null,
//                 refreshToken: account?.refresh_token ?? null,
//                 expiresAt: account?.expires_at ?? null,
//               },
//             },
//           },
//           update: {
//             name: profile.name ?? null,
//             avatarUrl: profile.image ?? null,
//             accounts: {
//               upsert: {
//                 where: {
//                   provider_providerUserId: {
//                     provider,
//                     providerUserId,
//                   },
//                 },
//                 create: {
//                   provider,
//                   providerUserId,
//                   accessToken: account?.access_token ?? null,
//                   refreshToken: account?.refresh_token ?? null,
//                   expiresAt: account?.expires_at ?? null,
//                 },
//                 update: {
//                   accessToken: account?.access_token ?? null,
//                   refreshToken: account?.refresh_token ?? null,
//                   expiresAt: account?.expires_at ?? null,
//                 },
//               },
//             },
//           },
//         });

//         const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
//         const headersList = await headers();
//         const userAgent = headersList.get('user-agent') || 'Unknown';
//         const device = JSON.stringify(getDeviceInfo(userAgent));

//         const existingSession = await prisma.session.findFirst({
//           where: {
//             userId: user.id,
//             device,
//             expiresAt: {
//               gt: new Date()
//             }
//           }
//         });

//         let sessionToken;
//         if (existingSession) {
//           sessionToken = existingSession.token;
//         } else {
//           sessionToken = generateToken({ id: user.id, email: user.email, device });
//           await prisma.session.create({
//             data: {
//               userId: user.id,
//               token: sessionToken,
//               expiresAt,
//               device,
//             },
//           });
//         }
//         return true;
//       } catch (error) {
//         console.error("Sign-in error:", error);
//         await setServerCookie('redirect_url', AUTHLY_LOGIN, cookieOption);
//         return false;
//       }
//     },
//     async redirect({ url, baseUrl }) {
//       try {
//           console.log("Redirect Callback - URL:", url, "Base URL:", baseUrl);
//           const redirectCookie = await getServerCookie('redirect_url');
//           const redirectPath = redirectCookie?.value || '/';
//           return `${baseUrl}${redirectPath}`;
//       } catch (error) {
//         console.error("Redirect error:", error);
//         return `${baseUrl}${CLOUDLINK_DASHBOARD}`;
//       }
//     },
//   },
//   pages: {
//     signIn: AUTHLY_LOGIN,
//     error: AUTHLY_ERROR,
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NEXTAUTH_DEBUG === "true",
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
