import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

console.log("Callback API LOADED");

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("No code provided");
    return NextResponse.redirect(new URL("/error?message=No code provided", req.url));
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_URL}/api/google/callback`
  );

  try {
    console.log("Exchanging code for tokens with code:", code);
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received:", tokens);

    oauth2Client.setCredentials(tokens);
    // TODO: store tokens in database here

    console.log("Redirecting to /form...");
    return NextResponse.redirect(
      new URL(
        `/form?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
        req.url
      )
    );
  } catch (error: any) {
    console.error("Google auth error:", error.response?.data || error.message);
    return NextResponse.redirect(new URL("/error?message=Google auth failed", req.url));
  }
}
