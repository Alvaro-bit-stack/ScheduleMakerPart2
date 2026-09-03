import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { requestHasExpectedOrigin } from "@/lib/google-oauth";
import {
  decryptOAuthSession,
  OAUTH_SESSION_COOKIE,
  oauthCookieOptions,
} from "@/lib/oauth-session";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const HEX_COLOR_PATTERN = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;

function backendConfiguration() {
  const configuredUrl = process.env.BACKEND_URL?.trim();
  const internalApiKey = process.env.INTERNAL_API_KEY?.trim();

  if (!configuredUrl || !internalApiKey) {
    throw new Error("Missing backend security configuration");
  }

  const backendUrl = new URL(configuredUrl);
  const isLocal =
    backendUrl.hostname === "localhost" ||
    backendUrl.hostname === "127.0.0.1";
  if (
    process.env.NODE_ENV === "production" &&
    !isLocal &&
    backendUrl.protocol !== "https:"
  ) {
    throw new Error("BACKEND_URL must use HTTPS in production");
  }

  return {
    uploadUrl: new URL("/api/upload", backendUrl).toString(),
    internalApiKey,
  };
}

function isValidTimezone(value: string): boolean {
  if (!value || value.length > 100) {
    return false;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function normalizedPalette(value: FormDataEntryValue | null): string | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== "string" || value.length > 4096) {
    throw new Error("Invalid palette");
  }

  const parsed: unknown = JSON.parse(value);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("name" in parsed) ||
    !("colors" in parsed) ||
    typeof parsed.name !== "string" ||
    parsed.name.length > 80 ||
    !Array.isArray(parsed.colors) ||
    parsed.colors.length === 0 ||
    parsed.colors.length > 12 ||
    !parsed.colors.every(
      (color) =>
        typeof color === "string" && HEX_COLOR_PATTERN.test(color),
    )
  ) {
    throw new Error("Invalid palette");
  }

  return JSON.stringify({
    name: parsed.name,
    colors: parsed.colors,
  });
}

function unauthorizedResponse() {
  const response = NextResponse.json(
    { error: "Your Google Calendar session has expired." },
    { status: 401 },
  );
  response.cookies.set(OAUTH_SESSION_COOKIE, "", oauthCookieOptions(0));
  return response;
}

export async function POST(request: NextRequest) {
  if (!requestHasExpectedOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "The schedule image must be 10 MB or smaller." },
      { status: 413 },
    );
  }

  const cookieStore = await cookies();
  const encryptedSession = cookieStore.get(OAUTH_SESSION_COOKIE)?.value;
  const session = encryptedSession
    ? decryptOAuthSession(encryptedSession)
    : null;
  if (!session || session.expiresAt <= Date.now()) {
    return unauthorizedResponse();
  }

  let incomingForm: FormData;
  try {
    incomingForm = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "The submitted form could not be read." },
      { status: 400 },
    );
  }

  const scheduleFile = incomingForm.get("fileUpload");
  const timezone = incomingForm.get("timezone");
  if (
    !(scheduleFile instanceof File) ||
    scheduleFile.size === 0 ||
    scheduleFile.size > MAX_UPLOAD_BYTES ||
    !ALLOWED_IMAGE_TYPES.has(scheduleFile.type)
  ) {
    return NextResponse.json(
      { error: "Choose a PNG, JPG, or WebP schedule image up to 10 MB." },
      { status: 400 },
    );
  }
  if (typeof timezone !== "string" || !isValidTimezone(timezone)) {
    return NextResponse.json(
      { error: "Choose a valid calendar timezone." },
      { status: 400 },
    );
  }

  let palette: string | null;
  try {
    palette = normalizedPalette(incomingForm.get("palette"));
  } catch {
    return NextResponse.json(
      { error: "Choose a valid calendar color theme." },
      { status: 400 },
    );
  }

  let backend;
  try {
    backend = backendConfiguration();
  } catch {
    return NextResponse.json(
      { error: "The schedule service is not configured." },
      { status: 503 },
    );
  }

  const backendForm = new FormData();
  backendForm.set("fileUpload", scheduleFile, scheduleFile.name);
  backendForm.set("timezone", timezone);
  if (palette) {
    backendForm.set("palette", palette);
  }

  try {
    const backendResponse = await fetch(backend.uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Internal-API-Key": backend.internalApiKey,
      },
      body: backendForm,
      cache: "no-store",
      signal: AbortSignal.timeout(120_000),
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        return unauthorizedResponse();
      }
      return NextResponse.json(
        { error: "The schedule could not be processed. Please try again." },
        { status: 502 },
      );
    }

    const result: unknown = await backendResponse.json();
    const count =
      typeof result === "object" &&
      result !== null &&
      "count" in result &&
      typeof result.count === "number"
        ? result.count
        : null;
    if (count === null) {
      return NextResponse.json(
        { error: "The schedule service returned an invalid response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ status: "ok", count });
  } catch {
    return NextResponse.json(
      { error: "The schedule service is temporarily unavailable." },
      { status: 502 },
    );
  }
}
