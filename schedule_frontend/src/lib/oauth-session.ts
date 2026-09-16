import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const OAUTH_SESSION_COOKIE = "calsnap_oauth_session";
export const OAUTH_STATE_COOKIE = "calsnap_oauth_state";
export const OAUTH_PKCE_COOKIE = "calsnap_oauth_pkce";

export type OAuthSession = {
  accessToken: string;
  expiresAt: number;
};

function encryptionKey(): Buffer {
  const secret = process.env.OAUTH_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("Missing required environment variable: OAUTH_SESSION_SECRET");
  }

  return createHash("sha256").update(secret).digest();
}

export function encryptOAuthSession(session: OAuthSession): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(session), "utf8"),
    cipher.final(),
  ]);
  const authenticationTag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64url"),
    authenticationTag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptOAuthSession(value: string): OAuthSession | null {
  const [version, encodedIv, encodedTag, encodedCiphertext] = value.split(".");
  if (
    version !== "v1" ||
    !encodedIv ||
    !encodedTag ||
    !encodedCiphertext
  ) {
    return null;
  }

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      encryptionKey(),
      Buffer.from(encodedIv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(encodedCiphertext, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const parsed: unknown = JSON.parse(plaintext);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("accessToken" in parsed) ||
      !("expiresAt" in parsed) ||
      typeof parsed.accessToken !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function secureValuesMatch(first: string, second: string): boolean {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);
  return (
    firstBuffer.length === secondBuffer.length &&
    timingSafeEqual(firstBuffer, secondBuffer)
  );
}

export function oauthCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
