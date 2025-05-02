import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { store } from "@/store/store";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { resetOnboarding } from "@/store/slices/onboardingSlice";

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // If there's a session, delete it from the database
    if (session?.user?.id) {
      // Delete the session from the database
      await prisma.session.deleteMany({
        where: {
          userId: session.user.id
        }
      });
    }
    
    // Get the authorization token from the request header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token) {
      // Delete the specific session with this token if it exists
      await prisma.session.deleteMany({
        where: {
          sessionToken: token
        }
      });
    }
    
    // Clear Redux state
    store.dispatch(logoutAction());
    store.dispatch(resetOnboarding());
    
    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete('next-auth.session-token');
    cookieStore.delete('next-auth.callback-url');
    cookieStore.delete('next-auth.csrf-token');
    cookieStore.delete('__Secure-next-auth.session-token');
    cookieStore.delete('__Host-next-auth.csrf-token');
    
    // Create response with cleared cookies
    const response = NextResponse.json({ 
      success: true, 
      message: "Logged out successfully" 
    });
    
    // Also clear cookies in the response
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('__Host-next-auth.csrf-token');
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
