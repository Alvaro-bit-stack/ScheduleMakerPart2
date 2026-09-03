import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  createGoogleOAuthClient,
  getAppUrl,
  GOOGLE_CALENDAR_SCOPE,
} from "@/lib/google-oauth";
import {
  encryptOAuthSession,
  OAUTH_PKCE_COOKIE,
  OAUTH_SESSION_COOKIE,
  OAUTH_STATE_COOKIE,
  oauthCookieOptions,
  secureValuesMatch,
} from "@/lib/oauth-session";

export const runtime = "nodejs";

function clearAuthorizationCookies(response: NextResponse) {
  response.cookies.set(OAUTH_STATE_COOKIE, "", oauthCookieOptions(0));
  response.cookies.set(OAUTH_PKCE_COOKIE, "", oauthCookieOptions(0));
}

function redirectToConnect(error: string) {
  return NextResponse.redirect(
    new URL(`/connect?error=${encodeURIComponent(error)}`, getAppUrl()),
  );
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const oauthError = requestUrl.searchParams.get("error");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  const codeVerifier = cookieStore.get(OAUTH_PKCE_COOKIE)?.value;

  if (oauthError) {
    const response = redirectToConnect("authorization_denied");
    clearAuthorizationCookies(response);
    return response;
  }

  if (
    !code ||
    !state ||
    !expectedState ||
    !codeVerifier ||
    !secureValuesMatch(state, expectedState)
  ) {
    const response = redirectToConnect("invalid_authorization");
    clearAuthorizationCookies(response);
    return response;
  }

  try {
    const oauth2Client = createGoogleOAuthClient();
    const { tokens } = await oauth2Client.getToken({ code, codeVerifier });
    const grantedScopes = new Set(tokens.scope?.split(/\s+/).filter(Boolean));

    if (
      !tokens.access_token ||
      (grantedScopes.size > 0 && !grantedScopes.has(GOOGLE_CALENDAR_SCOPE))
    ) {
      const response = redirectToConnect("missing_permission");
      clearAuthorizationCookies(response);
      return response;
    }

    const expiresAt = tokens.expiry_date ?? Date.now() + 55 * 60 * 1000;
    const maxAge = Math.max(
      60,
      Math.min(60 * 60, Math.floor((expiresAt - Date.now()) / 1000)),
    );
    const response = NextResponse.redirect(new URL("/form", getAppUrl()));
    response.cookies.set(
      OAUTH_SESSION_COOKIE,
      encryptOAuthSession({
        accessToken: tokens.access_token,
        expiresAt,
      }),
      oauthCookieOptions(maxAge),
    );
    clearAuthorizationCookies(response);
    return response;
  } catch {
    const response = redirectToConnect("authorization_failed");
    clearAuthorizationCookies(response);
    return response;
  }
}
