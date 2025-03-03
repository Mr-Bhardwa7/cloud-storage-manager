import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json({ status: 400, message: "BAD_REQUEST: Product id is not specified" });
}

export async function GET(req: Request) {
  return NextResponse.json({ status: 200, message: "BAD_REQUEST: Product id is not specified" });
}
