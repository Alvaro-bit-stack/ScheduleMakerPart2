import "server-only";

import { google } from "googleapis";

export const GOOGLE_CALENDAR_SCOPE =
  "https://www.googleapis.com/auth/calendar.events.owned";

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAppUrl(): string {
  const configuredUrl = process.env.APP_URL?.trim();
  if (!configuredUrl) {
    throw new Error("Missing required environment variable: APP_URL");
  }

  const appUrl = new URL(configuredUrl);
  const isLocal =
    appUrl.hostname === "localhost" || appUrl.hostname === "127.0.0.1";
  if (
    process.env.NODE_ENV === "production" &&
    !isLocal &&
    appUrl.protocol !== "https:"
  ) {
    throw new Error("APP_URL must use HTTPS in production");
  }

  return appUrl.origin;
}

export function createGoogleOAuthClient() {
  return new google.auth.OAuth2(
    requiredEnvironmentValue("GOOGLE_CLIENT_ID"),
    requiredEnvironmentValue("GOOGLE_CLIENT_SECRET"),
    `${getAppUrl()}/api/google/callback`,
  );
}

export function requestHasExpectedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === getAppUrl();
}
