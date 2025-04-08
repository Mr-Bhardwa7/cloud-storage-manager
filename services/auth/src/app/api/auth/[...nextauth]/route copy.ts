// import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import EmailProvider from "next-auth/providers/email";
// import { AUTHLY_ERROR, AUTHLY_LOGIN, AUTHLY_ONBOARDING } from "@/constants/routes";
// import { sendMagicLink } from "@/utils/email_";
// import { prisma } from "@/lib/prisma";
// import { headers } from "next/headers";
// import { getDeviceInfo } from "@/utils/device";
// import { generateToken } from "@/utils/auth";
// import { MagicLinkAdapter } from "@/lib/magicLinkAdapter";

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

// const authOptions: NextAuthOptions = {
//     adapter: MagicLinkAdapter(prisma),
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),
//         GitHubProvider({
//             clientId: process.env.GITHUB_CLIENT_ID!,
//             clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//         }),
//         EmailProvider({
//             server: {
//                 host: process.env.BREVO_SMTP_HOST,
//                 port: Number(process.env.BREVO_SMTP_PORT),
//                 auth: {
//                     user: process.env.BREVO_SMTP_USER,
//                     pass: process.env.BREVO_SMTP_PASS,
//                 },
//                 secure: Number(process.env.BREVO_SMTP_PORT) === 465,
//             },
//             from: process.env.BREVO_SENDER_EMAIL,
//             maxAge: 15 * 60 * 1000, // 15 min
//             sendVerificationRequest: async ({ identifier: email, url, token, provider }) => {
//                 try {
//                     await sendMagicLink(
//                         email,
//                         `${process.env.BASE_URL}/auth/token-verification?token=${token}`,
//                         provider
//                     );
//                 } catch (error) {
//                     console.error("Error in sendMagicLink:", error);
//                     throw error; // don't silently swallow
//                 }
//             },
//         }),
//     ],
//      logger: {
//         error(code, metadata) {
//             console.error("[NextAuth][Error]", code, metadata);
//         },
//         warn(code) {
//             console.warn("[NextAuth][Warning]", code);
//         },
//         debug(code, metadata) {
//             console.debug("[NextAuth][Debug]", code, metadata);
//         },
//     },
//     pages: {
//         signIn: AUTHLY_LOGIN,
//         error: AUTHLY_ERROR,
//         newUser: AUTHLY_ONBOARDING,
//     },
//     session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 const existingUser = await prisma.user.findUnique({
//                     where: { email: user.email! },
//                 });

//                 if (existingUser) {
//                 const existingSession = await prisma.session.findFirst({
//                     where: { userId: existingUser.id, expiresAt: { gt: new Date() } },
//                 });

//                 token.jti = existingSession?.token ?? null;
//                 token.isNew = !existingUser; 
//                 }
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             const tokenId = token.jti as string; 

//             if (!tokenId) return session;

//             const existingSession = await prisma.session.findUnique({
//                 where: { token: tokenId },
//             });

//             if (!existingSession) return session;

//             if (new Date(existingSession.expiresAt) < new Date()) {
//                 console.log("Session expired for token:", tokenId);
//                 return session;
//             }

//             return {
//                 ...session,
//                 token: existingSession.token,
//                 expiresAt: existingSession.expiresAt,
//                 device: existingSession.device,
//             };
//         },
//         async signIn({ user, account, profile }) {
//             console.log("User Profile:", user);
//             console.log("User Profile:", profile);
//             console.log("User account:", account);
//             if (account?.provider === "email") return true;
//             if (!profile?.email) return false;

//             try {
//                 const existingUser = await prisma.user.findUnique({
//                     where: { email: profile.email },
//                     include: { onboarding: true }
//                 });
               
//                 const provider = account?.provider?.toLowerCase() ?? "";
//                 const providerAccountId = account?.providerAccountId ?? "";

//                 const user = await prisma.user.upsert({
//                     where: { email: profile.email },
//                     create: {
//                         email: profile.email,
//                         name: profile.name ?? null,
//                         avatarUrl: profile.image ?? null,
//                         accounts: {
//                             create: {
//                                 provider,
//                                 providerAccountId,
//                                 accessToken: account?.access_token ?? null,
//                                 refreshToken: account?.refresh_token ?? null,
//                                 expiresAt: account?.expires_at ?? null,
//                             },
//                         },
//                     },
//                     update: {
//                         name: profile.name ?? null,
//                         avatarUrl: profile.image ?? null,
//                         accounts: {
//                             upsert: {
//                                 where: {
//                                     provider_providerAccountId: {
//                                         provider,
//                                         providerAccountId,
//                                     },
//                                 },
//                                 create: {
//                                     provider,
//                                     providerAccountId,
//                                     accessToken: account?.access_token ?? null,
//                                     refreshToken: account?.refresh_token ?? null,
//                                     expiresAt: account?.expires_at ?? null,
//                                 },
//                                 update: {
//                                     accessToken: account?.access_token ?? null,
//                                     refreshToken: account?.refresh_token ?? null,
//                                     expiresAt: account?.expires_at ?? null,
//                                 },
//                             },
//                         },
//                     },
//                 });

//                 const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
//                 const headersList = await headers();
//                 const device = JSON.stringify(getDeviceInfo(headersList));

//                 const existingSession = await prisma.session.findFirst({
//                     where: {
//                             userId: user.id,
//                             device,
//                             expiresAt: {
//                             gt: new Date()
//                         }
//                     }
//                 });

//                 let sessionToken;
//                 if (existingSession) {
//                     sessionToken = existingSession.token;
//                 } else {
//                     sessionToken = generateToken({ id: user.id, email: user.email, device });
//                     await prisma.session.create({
//                         data: {
//                             userId: user.id,
//                             token: sessionToken,
//                             expiresAt,
//                             device,
//                         },
//                     });
//                 }
                
//                 if (!existingUser?.onboarding?.completed) return AUTHLY_ONBOARDING;
//                 return true;
//             } catch (error) {
//                 console.error("Sign-in error:", error);
//                 return AUTHLY_LOGIN;
//             }
//         },
//         async redirect({ url, baseUrl }) {
//             // Allows relative callback URLs
//             if (url.startsWith("/")) return `${baseUrl}${url}`
//             // Allows callback URLs on the same origin
//             else if (new URL(url).origin === baseUrl) return url
//             return baseUrl
//         },
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     debug: process.env.NEXTAUTH_DEBUG === "true",
// };  

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };