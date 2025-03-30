import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authToken = req.headers.get("cookie")?.match(/auth_token=([^;]+)/)?.[1];

  if (!authToken) {
    return NextResponse.json({ status: 401, message: "UNAUTHORIZED: No active session" });
  }

  return NextResponse.json({ status: 200, message: "SUCCESS: User is authenticated" });
}
