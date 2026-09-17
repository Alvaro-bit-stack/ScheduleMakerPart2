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

function getAllowedAppOrigins(): Set<string> {
  const configuredUrl = new URL(getAppUrl());
  const allowedOrigins = new Set([configuredUrl.origin]);
  const isLocal =
    configuredUrl.hostname === "localhost" ||
    configuredUrl.hostname === "127.0.0.1";

  if (!isLocal) {
    const alternateUrl = new URL(configuredUrl.origin);
    alternateUrl.hostname = configuredUrl.hostname.startsWith("www.")
      ? configuredUrl.hostname.slice(4)
      : `www.${configuredUrl.hostname}`;
    allowedOrigins.add(alternateUrl.origin);
  }

  return allowedOrigins;
}

export function requestHasExpectedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    return getAllowedAppOrigins().has(new URL(origin).origin);
  } catch {
    return false;
  }
}
