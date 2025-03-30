import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/utils/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessionToken = await getUserFromCookie();
    
    if (!sessionToken) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }
    
    const session = await prisma.session.findUnique({
      where: { token: sessionToken.toString() },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            accounts: true
          }
        }
      }
    });

    if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
      return NextResponse.json(
        { message: "Session expired" }, 
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: session.user
    });
    
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Authentication failed" },
      { status: 500 }
    );
  }
}
