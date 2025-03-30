import { NextResponse } from "next/server";
import { getOAuthLoginUrl } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    const { provider } = await req.json();

    if (!provider || !["google", "github"].includes(provider)) {
      return NextResponse.json({ status: 400, message: "Invalid provider" }, { status: 400 });
    }

    // Generate OAuth Login URL
    const redirectUrl = getOAuthLoginUrl(provider);

    return NextResponse.json({ status: 200, redirectUrl });
  } catch (error: unknown) {
      let errorMessage = "Internal Server Error";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return NextResponse.json({ status: 500, message: errorMessage }, { status: 500 });
    }
}
