import { randomBytes } from "node:crypto";
import { CodeChallengeMethod } from "google-auth-library";
import { NextResponse } from "next/server";
import {
  createGoogleOAuthClient,
  GOOGLE_CALENDAR_SCOPE,
} from "@/lib/google-oauth";
import {
  OAUTH_PKCE_COOKIE,
  OAUTH_STATE_COOKIE,
  oauthCookieOptions,
} from "@/lib/oauth-session";

export const runtime = "nodejs";

export async function GET() {
  const oauth2Client = createGoogleOAuthClient();
  const state = randomBytes(32).toString("base64url");
  const { codeVerifier, codeChallenge } =
    await oauth2Client.generateCodeVerifierAsync();

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: [GOOGLE_CALENDAR_SCOPE],
    state,
    code_challenge: codeChallenge,
    code_challenge_method: CodeChallengeMethod.S256,
  });

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(
    OAUTH_STATE_COOKIE,
    state,
    oauthCookieOptions(10 * 60),
  );
  response.cookies.set(
    OAUTH_PKCE_COOKIE,
    codeVerifier,
    oauthCookieOptions(10 * 60),
  );
  return response;
}
