import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "default_jwt_secret";
const COOKIE_NAME = "auth_token";

export interface UserPayload {
  id: string;
  email: string;
  name?: string;
  device?: string;
}

export function getOAuthLoginUrl(provider: string): string {
  const baseUrls: Record<string, string> = {
    google: `https://accounts.google.com/o/oauth2/auth`,
    github: `https://github.com/login/oauth/authorize`,
  };

  const clientIds: Record<string, string | undefined> = {
    google: process.env.GOOGLE_CLIENT_ID,
    github: process.env.GITHUB_CLIENT_ID,
  };

  const redirectUris: Record<string, string | undefined> = {
    google: process.env.GOOGLE_REDIRECT_URI,
    github: process.env.GITHUB_REDIRECT_URI,
  };

  if (!clientIds[provider] || !redirectUris[provider]) {
    throw new Error(`OAuth credentials missing for ${provider}`);
  }

  const params = new URLSearchParams({
    client_id: clientIds[provider]!,
    redirect_uri: redirectUris[provider]!,
    response_type: "code",
    scope: provider === "google" ? "openid email profile" : "user:email",
  });

  return `${baseUrls[provider]}?${params.toString()}`;
}


// Function to get OAuth user details (Google/GitHub)
export async function getOAuthUser(provider: string, code: string) {
    // Exchange code for access token
    const tokenResponse = await fetchOAuthToken(provider, code);
    if (!tokenResponse) return null;

    // Fetch user profile from provider
    return fetchUserProfile(provider, tokenResponse.access_token);
}

export async function fetchOAuthToken(provider: string, code: string) {
    let tokenUrl: string;
    let clientId: string;
    let clientSecret: string;
    let redirectUri: string;

    if (provider === "google") {
        tokenUrl = "https://oauth2.googleapis.com/token";
        clientId = process.env.GOOGLE_CLIENT_ID || "";
        clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
        redirectUri = process.env.GOOGLE_REDIRECT_URI || "";
    } else if (provider === "github") {
        tokenUrl = "https://github.com/login/oauth/access_token";
        clientId = process.env.GITHUB_CLIENT_ID || "";
        clientSecret = process.env.GITHUB_CLIENT_SECRET || "";
        redirectUri = process.env.GITHUB_REDIRECT_URI || "";
    } else {
        throw new Error("Unsupported OAuth provider");
    }

    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    });

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch OAuth token from ${provider}`);
    }

    return response.json();
}

// Fetch user profile from provider
export async function fetchUserProfile(provider: string, accessToken: string) {
    let userUrl: string;
    let headers: Record<string, string>;

    if (provider === "google") {
        userUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
        headers = {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
        };
    } else if (provider === "github") {
        userUrl = "https://api.github.com/user";
        headers = {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        };
    } else {
        throw new Error("Unsupported OAuth provider");
    }

    const response = await fetch(userUrl, { headers });

    if (!response.ok) {
        throw new Error(`Failed to fetch user profile from ${provider}`);
    }

    const userData = await response.json();

    return {
        id: userData.id.toString(), // Convert GitHub ID to string for consistency
        email: userData.email || "",
        name: userData.name || userData.login || "",
        avatar: userData.picture || userData.avatar_url || "",
        isNewUser: true, // You might want to check DB if the user is new
    };
}

// Generate JWT Token
export function generateToken(payload: object) {
  if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not set in environment variables.");
  }

  return jwt.sign(payload, SECRET_KEY as string, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (typeof decoded === "object" && decoded !== null) {
      return decoded as JwtPayload;
    }

    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("JWT Verification Error:", error.message);
    }
    return null;
  }
}


// Set Cookie
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
}

// Get User from Cookie
export async function getUserFromCookie(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET_KEY) as UserPayload;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error verifying token:", error.message);
    }
    return null;
  }
}


// Clear Cookie (Logout)
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}
