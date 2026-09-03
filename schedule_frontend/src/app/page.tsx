import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Connect your calendar",
    description:
      "Sign in with Google so CalSnap can add the finished schedule directly to your calendar.",
  },
  {
    number: "02",
    title: "Drop in a screenshot",
    description:
      "Upload the schedule you already have. No templates, spreadsheets, or manual typing.",
  },
  {
    number: "03",
    title: "Choose a look and sync",
    description:
      "Pick your timezone and color theme, then send every recurring class to Google Calendar.",
  },
];

const week = [
  { day: "M", events: ["9:30", "1:00"] },
  { day: "T", events: ["11:00"] },
  { day: "W", events: ["9:30", "1:00"] },
  { day: "T", events: ["11:00", "12:30"] },
  { day: "F", events: ["1:00"] },
];

export default function Home() {
  return (
    <div className="landing-page min-h-screen overflow-hidden bg-[var(--landing-bg)] font-sans text-[var(--landing-ink)]">
      <header className="relative z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--landing-bg)]"
            aria-label="CalSnap home"
          >
            <BrandMark />
            <span className="text-lg font-semibold tracking-[-0.03em]">CalSnap</span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 text-sm font-medium text-[var(--landing-muted)] sm:flex"
          >
            <a
              href="#how"
              className="rounded-full px-4 py-3 transition-colors duration-200 hover:bg-[var(--landing-sage)] hover:text-[var(--landing-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)]"
            >
              How it works
            </a>
            <a
              href="#why"
              className="rounded-full px-4 py-3 transition-colors duration-200 hover:bg-[var(--landing-sage)] hover:text-[var(--landing-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)]"
            >
              What it adds
            </a>
          </nav>

          <a
            href="/connect"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--landing-ink)] px-4 py-2.5 text-sm font-semibold text-[var(--landing-bg)] transition-colors duration-200 hover:bg-[var(--landing-forest)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--landing-bg)] sm:px-5"
          >
            Get started
            <ArrowIcon />
          </a>
        </div>
      </header>

      <main>
        <section className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-32 top-24 h-64 w-64 rounded-[42%_58%_63%_37%/55%_38%_62%_45%] bg-[var(--landing-sage)] sm:-left-20 sm:h-80 sm:w-80"
          />
          <div
            aria-hidden="true"
            className="absolute -right-20 top-4 h-48 w-48 rounded-[61%_39%_32%_68%/45%_55%_45%_55%] bg-[var(--landing-clay-soft)] lg:right-4 lg:h-64 lg:w-64"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10 lg:pb-36 lg:pt-24">
            <div className="max-w-xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-forest)]">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[var(--landing-clay)]"
                />
                Built for busy student weeks
              </p>

              <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
                Your class schedule, without the busywork.
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-lg leading-8 text-[var(--landing-muted)]">
                Turn one screenshot into a complete Google Calendar. CalSnap
                reads your class times, meeting days, and rooms so you do not
                have to enter them one by one.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/connect"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--landing-forest)] px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--landing-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--landing-bg)]"
                >
                  Start with Google Calendar
                  <ArrowIcon />
                </a>
                <a
                  href="#how"
                  className="inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-base font-semibold text-[var(--landing-forest)] underline decoration-[var(--landing-border-strong)] decoration-2 underline-offset-4 transition-colors duration-200 hover:text-[var(--landing-clay-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)]"
                >
                  See the three steps
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--landing-muted)]">
                <span className="inline-flex items-center gap-2">
                  <CheckIcon />
                  No manual event entry
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckIcon />
                  Recurring days included
                </span>
              </div>
            </div>

            <SchedulePreview />
          </div>
        </section>

        <section
          id="how"
          className="scroll-mt-8 border-y border-[var(--landing-border)] bg-[var(--landing-surface)]"
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--landing-clay-dark)]">
                  How it works
                </p>
                <h2 className="mt-4 max-w-sm text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                  Three small steps. One organized semester.
                </h2>
              </div>

              <ol className="grid gap-8 sm:grid-cols-3">
                {steps.map((step) => (
                  <li
                    key={step.number}
                    className="border-t border-[var(--landing-border-strong)] pt-5"
                  >
                    <span className="text-sm font-semibold text-[var(--landing-clay-dark)]">
                      {step.number}
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="why" className="scroll-mt-8">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center lg:px-10">
            <div className="relative mx-auto w-full max-w-md">
              <div
                aria-hidden="true"
                className="absolute -inset-7 rounded-[38%_62%_55%_45%/46%_42%_58%_54%] bg-[var(--landing-sage)]"
              />
              <div className="relative rounded-[2rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] p-5 sm:p-7">
                <div className="flex items-center justify-between border-b border-[var(--landing-border)] pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--landing-muted)]">
                      Your calendar
                    </p>
                    <p className="mt-1 font-semibold">A week that makes sense</p>
                  </div>
                  <CalendarIcon />
                </div>
                <div className="mt-5 grid grid-cols-5 gap-2">
                  {week.map((column, index) => (
                    <div key={`${column.day}-${index}`} className="min-w-0">
                      <div className="text-center text-xs font-semibold text-[var(--landing-muted)]">
                        {column.day}
                      </div>
                      <div className="mt-3 min-h-40 rounded-xl bg-[var(--landing-bg)] p-1.5">
                        {column.events.map((time, eventIndex) => (
                          <div
                            key={`${time}-${eventIndex}`}
                            className={`mb-2 rounded-lg px-1.5 py-2 text-center text-[10px] font-semibold ${
                              (index + eventIndex) % 3 === 0
                                ? "bg-[var(--landing-clay-soft)] text-[var(--landing-clay-dark)]"
                                : (index + eventIndex) % 3 === 1
                                  ? "bg-[var(--landing-sage)] text-[var(--landing-forest)]"
                                  : "bg-[var(--landing-sun-soft)] text-[var(--landing-sun-dark)]"
                            }`}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-lg lg:justify-self-end">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--landing-clay-dark)]">
                What CalSnap carries over
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                The useful details stay attached.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[var(--landing-muted)]">
                Each event keeps the information you need when you are rushing
                across campus—not just the course title.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Class and section name",
                  "Start and end time",
                  "Weekly meeting days",
                  "Classroom or building",
                  "Your local timezone",
                  "A color theme you choose",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium"
                  >
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[var(--landing-forest)] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute -left-14 -top-16 h-48 w-48 rounded-[63%_37%_45%_55%/41%_57%_43%_59%] bg-[var(--landing-sage)] opacity-20"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -right-12 h-56 w-56 rounded-[35%_65%_62%_38%/58%_40%_60%_42%] bg-[var(--landing-clay)] opacity-30"
            />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--landing-sage)]">
                Ready when you are
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Give yourself one less thing to organize.
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-7 text-white/75">
                Connect Google Calendar, upload your schedule, and let CalSnap
                build the recurring events.
              </p>
              <a
                href="/connect"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--landing-bg)] px-6 py-3 font-semibold text-[var(--landing-ink)] transition-colors duration-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--landing-forest)]"
              >
                Make my calendar
                <ArrowIcon />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--landing-border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[var(--landing-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span className="font-semibold text-[var(--landing-ink)]">CalSnap</span>
          <nav aria-label="Legal links" className="flex flex-wrap gap-x-5 gap-y-2">
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
          <span>© {new Date().getFullYear()} CalSnap</span>
        </div>
      </footer>
    </div>
  );
}

function SchedulePreview() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto min-h-[31rem] w-full max-w-[36rem]"
    >
      <div className="absolute left-0 top-0 w-[72%] -rotate-2 rounded-[2rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--landing-muted)]">
              Uploaded screenshot
            </p>
            <p className="mt-1 text-sm font-semibold">Fall class schedule</p>
          </div>
          <UploadIcon />
        </div>
        <div className="mt-5 space-y-3">
          {[
            ["HSSC 371-A", "Mon / Wed", "9:30 – 10:45"],
            ["CS 492-A", "Mon / Wed / Fri", "11:00 – 11:50"],
            ["CS 396-C", "Mon / Wed / Fri", "1:00 – 1:50"],
          ].map(([course, days, time], index) => (
            <div
              key={course}
              className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg)] p-3"
            >
              <span
                className={`mt-1 h-9 w-2 rounded-full ${
                  index === 0
                    ? "bg-[var(--landing-forest)]"
                    : index === 1
                      ? "bg-[var(--landing-clay)]"
                      : "bg-[var(--landing-sun)]"
                }`}
              />
              <div>
                <p className="text-sm font-semibold">{course}</p>
                <div className="mt-1 flex flex-wrap justify-between gap-1 text-[11px] text-[var(--landing-muted)]">
                  <span>{days}</span>
                  <span>{time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 180 90"
        className="absolute right-[7%] top-[35%] hidden h-24 w-44 text-[var(--landing-clay-dark)] sm:block"
        fill="none"
      >
        <path
          d="M8 67C52 12 112 13 164 48"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 7"
        />
        <path
          d="m151 51 14-3-5-13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="absolute bottom-0 right-0 w-[76%] rotate-2 rounded-[2rem] border border-[var(--landing-border-strong)] bg-[var(--landing-ink)] p-5 text-white sm:p-6">
        <div className="flex items-center justify-between border-b border-white/15 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Google Calendar
            </p>
            <p className="mt-1 text-sm font-semibold">Your week, ready to go</p>
          </div>
          <CalendarIcon light />
        </div>
        <div className="mt-5 grid grid-cols-5 gap-1.5">
          {week.map((column, index) => (
            <div key={`${column.day}-preview-${index}`}>
              <div className="text-center text-[10px] font-semibold text-white/55">
                {column.day}
              </div>
              <div className="mt-2 min-h-32 rounded-lg border border-white/10 p-1">
                {column.events.map((time, eventIndex) => (
                  <div
                    key={`${time}-preview-${eventIndex}`}
                    className={`mb-1.5 rounded px-1 py-1.5 text-center text-[8px] font-semibold text-[var(--landing-ink)] ${
                      (index + eventIndex) % 3 === 0
                        ? "bg-[var(--landing-clay-soft)]"
                        : (index + eventIndex) % 3 === 1
                          ? "bg-[var(--landing-sage)]"
                          : "bg-[var(--landing-sun-soft)]"
                    }`}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-[42%_58%_55%_45%/54%_43%_57%_46%] bg-[var(--landing-forest)] text-white">
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
    </span>
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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--landing-forest)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 10 4 4 8-9" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 text-[var(--landing-clay-dark)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

function CalendarIcon({ light = false }: { light?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${
        light ? "text-white/70" : "text-[var(--landing-clay-dark)]"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M8 3.5V7M16 3.5V7M3.5 10h17M8 14h3M14 14h2M8 17.5h2" />
    </svg>
  );
}
