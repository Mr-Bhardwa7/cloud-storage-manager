// services/auth/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 200, message: "Auth service is healthy!" });
}
