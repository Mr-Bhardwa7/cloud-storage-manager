import { NextResponse } from "next/server";
import { generateToken, setAuthCookie } from "@/utils/auth";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";

export async function POST(request: Request) {
    try {
        const { otp, email } = await request.json();

        if (!otp || !email) {
            return NextResponse.json(
                { message: `${!otp ? 'OTP' : 'Email'} is required` },
                { status: 400 }
            );
        }

        const magicLink = await prisma.magicLink.findFirst({
            where: { email, otp },
        });

        if (!magicLink?.otpExpires || magicLink.otpExpires < new Date()) {
            return NextResponse.json(
                { message: "OTP has expired or is invalid", success: false },
                { status: 401 }
            );
        }

        const parser = new UAParser(request.headers.get("user-agent") || "");
        const device = `${parser.getBrowser().name} on ${parser.getOS().name}`;
        const sessionToken = generateToken({ email, device });
        const sessionData = {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        };

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            await prisma.$transaction([
                prisma.user.create({
                    data: {
                        email,
                        accounts: {
                            create: {
                                provider: "MAGIC_LINK",
                                providerUserId: email,
                            }
                        },
                        sessions: {
                            create: sessionData
                        }
                    },
                })
            ]);
        } else {
            await prisma.session.create({
                data: {
                    ...sessionData,
                    userId: user.id,
                }
            });
        }

        setAuthCookie(sessionToken);

        return NextResponse.json(
            { success: true, message: "OTP verified successfully", token: sessionToken },
            { status: 200 }
        );

    } catch (error: unknown) {
        return NextResponse.json(
            { 
                message: error instanceof Error ? error.message : "Failed to verify OTP", 
                success: false 
            },
            { status: 500 }
        );
    }
}
