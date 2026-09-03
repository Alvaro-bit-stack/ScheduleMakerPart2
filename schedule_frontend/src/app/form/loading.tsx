export default function Loading() {
  return (
    <div className="form-page relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--landing-bg)] px-6 text-[var(--landing-ink)]">
      <div
        aria-hidden="true"
        className="absolute -left-20 top-20 h-64 w-64 rounded-[42%_58%_63%_37%/55%_38%_62%_45%] bg-[var(--landing-sage)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-16 bottom-12 h-56 w-56 rounded-[61%_39%_32%_68%/45%_55%_45%_55%] bg-[var(--landing-clay-soft)]"
      />
      <div
        className="relative flex max-w-sm flex-col items-center rounded-[2rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] px-8 py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-[42%_58%_55%_45%/54%_43%_57%_46%] bg-[var(--landing-sage)] text-[var(--landing-forest)]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-7 w-7 animate-spin"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.25"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <p className="mt-5 text-lg font-semibold">Getting your setup ready</p>
        <p className="mt-2 text-sm leading-6 text-[var(--landing-muted)]">
          This should only take a moment.
        </p>
      </div>
    </div>
  );
}
