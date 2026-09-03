import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  getAppUrl,
  requestHasExpectedOrigin,
} from "@/lib/google-oauth";
import {
  decryptOAuthSession,
  OAUTH_SESSION_COOKIE,
  oauthCookieOptions,
} from "@/lib/oauth-session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!requestHasExpectedOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const cookieStore = await cookies();
  const encryptedSession = cookieStore.get(OAUTH_SESSION_COOKIE)?.value;
  const session = encryptedSession
    ? decryptOAuthSession(encryptedSession)
    : null;
  let revoked = true;

  if (session) {
    try {
      const response = await fetch("https://oauth2.googleapis.com/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ token: session.accessToken }),
        cache: "no-store",
      });
      revoked = response.ok;
    } catch {
      revoked = false;
    }
  }

  const destination = revoked ? "/" : "/connect?error=revocation_failed";
  const response = NextResponse.redirect(new URL(destination, getAppUrl()), 303);
  response.cookies.set(OAUTH_SESSION_COOKIE, "", oauthCookieOptions(0));
  return response;
}
