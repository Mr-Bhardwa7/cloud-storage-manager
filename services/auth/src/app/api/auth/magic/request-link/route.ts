import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { sendMagicLink } from "@/utils/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" }, 
        { status: 400 }
      );
    }

    const token = nanoid(32);
    const magicLinkData = {
      token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      otp: null,
      otpExpires: null,
      used: false
    };

    await prisma.magicLink.upsert({
      where: { email },
      update: {...magicLinkData, updatedAt: new Date()},
      create: { email, ...magicLinkData }
    });

    await sendMagicLink(
      email, 
      `${process.env.BASE_URL}/token-verification?token=${token}`
    );

    return NextResponse.json(
      { message: "Magic link sent!" }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to send magic link" },
      { status: 500 }
    );
  }
}
