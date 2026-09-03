import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalPage({
  eyebrow,
  title,
  introduction,
  children,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
}) {
  return (
    <div className="landing-page min-h-screen bg-[var(--landing-bg)] font-sans text-[var(--landing-ink)]">
      <header className="border-b border-[var(--landing-border)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[42%_58%_55%_45%/54%_43%_57%_46%] bg-[var(--landing-forest)] text-white">
              <CalendarIcon />
            </span>
            <span className="text-lg font-semibold tracking-[-0.03em]">CalSnap</span>
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-[var(--landing-forest)] transition-colors duration-200 hover:bg-[var(--landing-sage)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)]"
          >
            Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--landing-clay-dark)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--landing-muted)]">
          {introduction}
        </p>
        <p className="mt-4 text-sm font-medium text-[var(--landing-muted)]">
          Last updated: August 31, 2026
        </p>

        <div className="legal-content mt-12 space-y-10 border-t border-[var(--landing-border-strong)] pt-10">
          {children}
        </div>
      </main>

      <footer className="border-t border-[var(--landing-border)]">
        <nav
          aria-label="Legal links"
          className="mx-auto flex max-w-4xl flex-wrap gap-x-5 gap-y-2 px-5 py-8 text-sm font-medium text-[var(--landing-muted)] sm:px-8"
        >
          <Link className="underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
          <Link className="underline underline-offset-4" href="/terms">
            Terms
          </Link>
          <Link className="underline underline-offset-4" href="/data-deletion">
            Data deletion
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5.5" width="16" height="14" rx="3" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h3M14 14h2M8 17h2" />
    </svg>
  );
}
