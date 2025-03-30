import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { message: "Token is missing." },
      { status: 400 }
    );
  }

  try {
    const magicTokenUser = await prisma.magicLink.findUnique({
      where: { token },
      select: { email: true, expiresAt: true, used: true }
    });

    if (!magicTokenUser?.expiresAt || magicTokenUser.expiresAt < new Date() || magicTokenUser.used) {
      return NextResponse.json(
        { message: "Invalid or expired magic link." },
        { status: 400 }
      );
    }

    const otp = String(100000 + Math.floor(Math.random() * 900000));
    
    await prisma.magicLink.update({
      where: { email: magicTokenUser.email },
      data: {
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
        used: true
      }
    });
    
    return NextResponse.json(
      { message: "Token verified successfully", otp, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "Failed to verify token",
        success: false 
      },
      { status: 500 }
    );
  }
}
