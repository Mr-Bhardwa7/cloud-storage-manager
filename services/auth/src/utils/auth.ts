import jwt, { JwtPayload } from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET!;

export interface UserPayload {
  id: string;
  email: string;
  name?: string;
  device?: string;
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