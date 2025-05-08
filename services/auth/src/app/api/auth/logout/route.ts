import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Check if user wants to logout from all devices
    const url = new URL(request.url);
    const logoutAll = url.searchParams.get("all") === "true";
    
    // Get the current session
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;
    let sessionToken = session?.token;
    
    // If no session found, try the Authorization header
    if (!sessionToken) {
      const authHeader = request.headers.get('Authorization');
      sessionToken = authHeader?.replace('Bearer ', '');
    }
    
    // If still no session token, try the cookie
    if (!sessionToken) {
      sessionToken = request.cookies.get('next-auth.session-token')?.value;
    }
    
    // If we have a token but no user ID, try to get the user ID from the session
    if (sessionToken && !userId) {
      const dbSession = await prisma.session.findUnique({
        where: { sessionToken },
        select: { userId: true }
      });
      userId = dbSession?.userId;
    }
    
    // Delete the appropriate sessions
    if (logoutAll && userId) {
      // Delete all sessions for this user
      await prisma.session.deleteMany({
        where: { userId }
      });
    } else if (sessionToken) {
      // Delete only the current session
      await prisma.session.deleteMany({
        where: { sessionToken }
      });
    }
    
    // Clear cookies from the server
    const cookieStore = await cookies();
    const cookieNames = [
      "next-auth.session-token",
      "next-auth.callback-url",
      "next-auth.csrf-token",
      "__Secure-next-auth.session-token",
      "__Host-next-auth.csrf-token",
      "authly-sid"
    ];
    
    cookieNames.forEach(name => {
      cookieStore.delete(name);
    });
    
    // Create response with cleared cookies
    const response = NextResponse.json({ 
      success: true, 
      message: logoutAll ? "Logged out from all devices" : "Logged out successfully" 
    });
    
    // Also clear cookies in the response
    cookieNames.forEach(name => {
      response.cookies.delete(name);
    });
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  } finally {
    const cookieStore = await cookies();
    const cookieNames = [
      "next-auth.session-token",
      "next-auth.callback-url",
      "next-auth.csrf-token",
      "__Secure-next-auth.session-token",
      "__Host-next-auth.csrf-token",
      "authly-sid"
    ];
    
    cookieNames.forEach(name => {
      cookieStore.delete(name);
    });
  }
}
