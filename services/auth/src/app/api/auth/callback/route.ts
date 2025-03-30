import { NextResponse } from "next/server";
import { getOAuthUser, generateToken, setAuthCookie } from "@/utils/auth";
import { UAParser } from "ua-parser-js";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const provider = url.searchParams.get("provider");
        const code = url.searchParams.get("code");

        if (!provider || !code) {
            return NextResponse.json({ status: 400, message: "Missing provider or authorization code" });
        }

        // Get user details from OAuth provider
        const user = await getOAuthUser(provider, code);
        const parser = new UAParser(req.headers.get("user-agent") || "");
        const device = `${parser.getBrowser().name} on ${parser.getOS().name}`;

        if (!user) {
            return NextResponse.json({ status: 401, message: "Failed to retrieve user information" });
        }

        // Generate JWT token
        const token = generateToken({ id: user.id, email: user.email, name: user.name, device });

        // Store session data in a cookie
        setAuthCookie(token);

        // Redirect to onboarding if first-time login, otherwise to dashboard
        const redirectUrl = user.isNewUser ? "/onboarding" : "/dashboard";
        return NextResponse.redirect(new URL(redirectUrl, req.url));

    } catch (error) {
        console.error("OAuth Callback Error:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
