import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connect Google Calendar — CalSnap",
  description:
    "Review how CalSnap uses Google Calendar access before continuing to Google.",
};

const ERROR_MESSAGES: Record<string, string> = {
  authorization_denied:
    "Google authorization was cancelled. No Calendar access was granted.",
  invalid_authorization:
    "The authorization request expired or could not be verified. Please try again.",
  missing_permission:
    "The required Calendar permission was not granted. Please try again.",
  authorization_failed:
    "Google authorization could not be completed. Please try again.",
  session_expired:
    "Your short-lived Calendar session expired. Connect again to continue.",
  revocation_failed:
    "Your local session was removed, but Google could not confirm revocation. You can also remove CalSnap from your Google Account permissions.",
};

export default async function Connect({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <div className="landing-page relative min-h-screen overflow-hidden bg-[var(--landing-bg)] font-sans text-[var(--landing-ink)]">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-40 h-72 w-72 rounded-[42%_58%_63%_37%/55%_38%_62%_45%] bg-[var(--landing-sage)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 top-12 h-60 w-60 rounded-[61%_39%_32%_68%/45%_55%_45%_55%] bg-[var(--landing-clay-soft)]"
      />

      <header className="relative z-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.03em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)]"
          >
            CalSnap
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-[var(--landing-forest)] transition-colors duration-200 hover:bg-[var(--landing-sage)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)]"
          >
            Back home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="rounded-[2.5rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--landing-clay-dark)]">
            Before you connect
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
            You stay in control of your calendar.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--landing-muted)]">
            CalSnap asks for the narrow Calendar permission needed to create the
            recurring class events you request.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-[var(--landing-clay)] bg-[var(--landing-clay-soft)] px-4 py-3 text-sm font-semibold text-[var(--landing-clay-dark)]"
            >
              {errorMessage}
            </div>
          )}

          <div className="mt-8 space-y-4">
            <Disclosure
              number="01"
              title="Calendar permission"
              description="Google's permission can view and edit events on calendars you own. CalSnap uses it only to create the schedule events you submit."
            />
            <Disclosure
              number="02"
              title="Short-lived secure access"
              description="Your Google access token is encrypted in an HttpOnly cookie, is unavailable to page JavaScript, and expires in about one hour. CalSnap does not request a refresh token."
            />
            <Disclosure
              number="03"
              title="Schedule image processing"
              description="After you upload a schedule, its image is sent to Google Cloud Vision and OpenAI to extract class details. Your Google token and existing Calendar event data are not sent to those services."
            />
          </div>

          <div className="mt-8 rounded-2xl bg-[var(--landing-sage)] p-4 text-sm leading-6 text-[var(--landing-forest)]">
            You can disconnect from the setup page at any time. CalSnap will
            revoke the active token and delete its local session cookie.
          </div>

          <a
            href="/api/google/auth"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--landing-forest)] px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[var(--landing-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)] focus-visible:ring-offset-4"
          >
            Continue to Google
            <ArrowIcon />
          </a>
          <p className="mt-4 text-center text-sm leading-6 text-[var(--landing-muted)]">
            By continuing, you acknowledge the{" "}
            <Link className="underline underline-offset-4" href="/privacy">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="underline underline-offset-4" href="/terms">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

function Disclosure({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <section className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg)] p-4">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--landing-clay-soft)] text-xs font-semibold text-[var(--landing-clay-dark)]">
        {number}
      </span>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--landing-muted)]">
          {description}
        </p>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}
