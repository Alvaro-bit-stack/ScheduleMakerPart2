"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";

type Palette = {
  name: string;
  colors: string[];
  image?: string;
};

const PALETTES: Palette[] = [
  {
    name: "Howls Moving Castle",
    colors: ["#102f49", "#754957", "#274d6f", "#c97234", "#5981a7", "#ffca5d"],
    image: "/PalletesPhotos/HowlsMovingCastle.png",
  },
  {
    name: "Ponyo",
    colors: ["#27456c", "#47748b", "#99bfd5", "#eccca6", "#e95c6c", "#f7a088"],
    image: "/PalletesPhotos/ponyo.png",
  },
  {
    name: "Spirited Away",
    colors: ["#59a9a1", "#3a7171", "#cae0ec", "#91b0bd", "#163352", "#c5b0cd"],
  },
  {
    name: "Matcha",
    colors: ["#A5AA70", "#AAA18F", "#C6BDA7", "#9CAF88", "#7A8450"],
  },
];

const TIMEZONES = [
  { label: "Eastern time", value: "America/New_York" },
  { label: "Central time", value: "America/Chicago" },
  { label: "Mountain time", value: "America/Denver" },
  { label: "Pacific time", value: "America/Los_Angeles" },
  { label: "London time", value: "Europe/London" },
  { label: "Tokyo time", value: "Asia/Tokyo" },
];

export default function Form() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[0].value);
  const [status, setStatus] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);

  useEffect(() => {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIMEZONES.some((timezone) => timezone.value === browserTimezone)) {
      const updateTimezone = window.setTimeout(
        () => setSelectedTimezone(browserTimezone),
        0,
      );
      return () => window.clearTimeout(updateTimezone);
    }
  }, []);

  useEffect(() => {
    if (status?.kind === "error") {
      statusRef.current?.focus();
    }
  }, [status]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setFileType(null);
      setFileName(null);
      return;
    }

    setFileError(null);
    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      setPreviewUrl(readerEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setFileError(null);

    const formData = new FormData(event.currentTarget);
    const scheduleFile = formData.get("fileUpload");

    if (!(scheduleFile instanceof File) || !scheduleFile.size) {
      setFileError("Choose a schedule screenshot before creating your calendar.");
      fileInputRef.current?.focus();
      return;
    }

    if (selectedPalette) {
      formData.append("palette", JSON.stringify(selectedPalette));
    }

    setLoading(true);
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        body: formData,
      });
      const data: unknown = await response.json();

      if (response.status === 401) {
        router.push("/connect?error=session_expired");
        return;
      }

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "The schedule could not be processed. Please try again.";
        throw new Error(message);
      }

      const count =
        typeof data === "object" &&
        data !== null &&
        "count" in data &&
        typeof data.count === "number"
          ? data.count
          : 0;
      setStatus({
        kind: "success",
        message: `Synced ${count} class${count === 1 ? "" : "es"} to your Google Calendar${
          selectedPalette ? ` in the ${selectedPalette.name} theme` : ""
        }.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating your calendar.",
      });
    } finally {
      setLoading(false);
    }
  }

  const timezoneLabel =
    TIMEZONES.find((timezone) => timezone.value === selectedTimezone)?.label ??
    selectedTimezone;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="form-page relative min-h-screen overflow-x-hidden bg-[var(--landing-bg)] font-sans text-[var(--landing-ink)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-44 h-72 w-72 rounded-[42%_58%_63%_37%/55%_38%_62%_45%] bg-[var(--landing-sage)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-[61%_39%_32%_68%/45%_55%_45%_55%] bg-[var(--landing-clay-soft)]"
      />

      <header className="relative z-20 border-b border-[var(--landing-border)] bg-[var(--landing-bg)]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--landing-bg)]"
            aria-label="Back to Schedulr home"
          >
            <BrandMark />
            <span className="text-lg font-semibold tracking-[-0.03em]">Schedulr</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/privacy"
              className="hidden min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-[var(--landing-forest)] transition-colors duration-200 hover:bg-[var(--landing-sage)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)] sm:inline-flex"
            >
              Privacy
            </Link>
            <form action="/api/google/disconnect" method="post">
              <button
                type="submit"
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 py-2 text-sm font-semibold text-[var(--landing-clay-dark)] transition-colors duration-200 hover:bg-[var(--landing-clay-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)]"
              >
                Disconnect
              </button>
            </form>
            <Link
              href="/"
              className="hidden min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--landing-forest)] transition-colors duration-200 hover:bg-[var(--landing-sage)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)] md:inline-flex"
            >
              <BackIcon />
              Back home
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <form
          className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
          onSubmit={handleSubmit}
          aria-labelledby="form-title"
          aria-busy={loading}
        >
          <div className="mb-10 max-w-2xl sm:mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--landing-clay-dark)]">
              Calendar setup
            </p>
            <h1
              id="form-title"
              className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl"
            >
              Turn your screenshot into a semester.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--landing-muted)]">
              Choose where the events belong, upload your schedule, and give
              your calendar a color theme.
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-10">
            <div className="space-y-5 sm:space-y-6">
              <section className="rounded-[2rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] p-5 sm:p-7">
                <StepHeading
                  number="01"
                  title="Set your timezone"
                  description="This keeps every class on the correct local day and time."
                />

                <div className="mt-6">
                  <label
                    htmlFor="timezone"
                    className="text-sm font-semibold text-[var(--landing-ink)]"
                  >
                    Calendar timezone
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="timezone"
                      name="timezone"
                      value={selectedTimezone}
                      onChange={(event) => setSelectedTimezone(event.target.value)}
                      className="min-h-12 w-full appearance-none rounded-2xl border border-[var(--landing-border-strong)] bg-[var(--landing-bg)] px-4 py-3 pr-11 text-base text-[var(--landing-ink)] outline-none transition-colors duration-200 hover:border-[var(--landing-forest)] focus:border-[var(--landing-forest)] focus:ring-2 focus:ring-[var(--landing-focus)] focus:ring-offset-2"
                    >
                      {TIMEZONES.map((timezone) => (
                        <option key={timezone.value} value={timezone.value}>
                          {timezone.label} — {timezone.value}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--landing-muted)]">
                    We select your browser timezone when it matches an available
                    option.
                  </p>
                </div>
              </section>

              <section className="rounded-[2rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] p-5 sm:p-7">
                <StepHeading
                  number="02"
                  title="Upload your schedule"
                  description="A clear screenshot with visible class names, days, times, and rooms works best."
                />

                <div className="mt-6 rounded-2xl border border-dashed border-[var(--landing-border-strong)] bg-[var(--landing-bg)] p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--landing-sage)] text-[var(--landing-forest)]">
                      <UploadIcon />
                    </span>
                    <div>
                      <label
                        htmlFor="fileUpload"
                        className="text-sm font-semibold text-[var(--landing-ink)]"
                      >
                        Schedule screenshot
                      </label>
                      <p
                        id="file-help"
                        className="mt-1 text-sm leading-6 text-[var(--landing-muted)]"
                      >
                        Choose a PNG, JPG, or WebP image up to 10 MB.
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    id="fileUpload"
                    name="fileUpload"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    aria-describedby={`file-help${fileError ? " file-error" : ""}`}
                    aria-invalid={Boolean(fileError)}
                    className="mt-5 block min-h-12 w-full cursor-pointer rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] text-sm text-[var(--landing-muted)] outline-none file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[var(--landing-forest)] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--landing-ink)] focus:ring-2 focus:ring-[var(--landing-focus)] focus:ring-offset-2"
                  />

                  {fileError && (
                    <p
                      id="file-error"
                      role="alert"
                      className="mt-3 text-sm font-semibold text-[var(--landing-clay-dark)]"
                    >
                      {fileError}
                    </p>
                  )}
                </div>

                {previewUrl && fileType?.startsWith("image/") && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg)]">
                    <div className="flex items-center justify-between gap-4 border-b border-[var(--landing-border)] px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">
                          Selected image
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold">
                          {fileName}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--landing-sage)] px-3 py-1 text-xs font-semibold text-[var(--landing-forest)]">
                        Ready
                      </span>
                    </div>
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={previewUrl}
                        alt="Preview of the selected schedule screenshot"
                        fill
                        unoptimized
                        className="object-contain p-3"
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] p-5 sm:p-7">
                <StepHeading
                  number="03"
                  title="Pick a color theme"
                  description="Each class cycles through the closest colors available in Google Calendar."
                />

                <div
                  className="mt-6 grid gap-3 sm:grid-cols-2"
                  role="radiogroup"
                  aria-label="Calendar color theme"
                >
                  {PALETTES.map((palette) => {
                    const selected = selectedPalette?.name === palette.name;
                    return (
                      <button
                        type="button"
                        key={palette.name}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setSelectedPalette(palette)}
                        className={`min-h-28 cursor-pointer rounded-2xl border p-4 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--landing-focus)] focus-visible:ring-offset-2 ${
                          selected
                            ? "border-[var(--landing-forest)] bg-[var(--landing-sage)]"
                            : "border-[var(--landing-border)] bg-[var(--landing-bg)] hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-surface)]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold">
                            {palette.name}
                          </span>
                          <span
                            className={`inline-flex min-w-16 items-center justify-end gap-1 text-xs font-semibold ${
                              selected
                                ? "text-[var(--landing-forest)]"
                                : "text-[var(--landing-muted)]"
                            }`}
                          >
                            {selected && <CheckIcon />}
                            {selected ? "Selected" : "Choose"}
                          </span>
                        </div>
                        <Swatches colors={palette.colors} className="mt-5" />
                      </button>
                    );
                  })}
                </div>
              </section>

              {status && (
                <div
                  ref={statusRef}
                  tabIndex={-1}
                  role={status.kind === "error" ? "alert" : "status"}
                  className={`rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--landing-focus)] ${
                    status.kind === "success"
                      ? "border-[var(--landing-border-strong)] bg-[var(--landing-sage)] text-[var(--landing-forest)]"
                      : "border-[var(--landing-clay)] bg-[var(--landing-clay-soft)] text-[var(--landing-clay-dark)]"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div className="rounded-[2rem] bg-[var(--landing-forest)] p-5 text-white sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Ready to build your calendar?
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-white/75">
                      Reading the screenshot and creating events can take a
                      moment.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--landing-bg)] px-6 py-3 font-semibold text-[var(--landing-ink)] outline-none transition-colors duration-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--landing-forest)] disabled:cursor-wait disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <SpinnerIcon />
                        Creating events…
                      </>
                    ) : (
                      <>
                        Submit &amp; sync
                        <ArrowIcon />
                      </>
                    )}
                  </button>
                </div>
                <p
                  className="mt-3 min-h-5 text-sm text-white/75"
                  role="status"
                  aria-live="polite"
                >
                  {loading
                    ? "Reading your schedule and adding recurring events to Google Calendar."
                    : ""}
                </p>
              </div>
            </div>

            <aside className="lg:sticky lg:top-6">
              <div className="rounded-[2rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface)] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--landing-clay-dark)]">
                  Your setup
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
                  A quick review
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--landing-muted)]">
                  These choices will be used when Schedulr creates your recurring
                  events.
                </p>

                <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg)]">
                  {previewUrl && fileType?.startsWith("image/") ? (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={previewUrl}
                        alt="Small preview of the selected schedule"
                        fill
                        unoptimized
                        className="object-contain p-3"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center px-6 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-[42%_58%_55%_45%/54%_43%_57%_46%] bg-[var(--landing-sage)] text-[var(--landing-forest)]">
                        <ScheduleIcon />
                      </span>
                      <p className="mt-4 text-sm font-semibold">
                        Your schedule preview will appear here
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--landing-muted)]">
                        Add an image in step two.
                      </p>
                    </div>
                  )}
                </div>

                <dl className="mt-6 divide-y divide-[var(--landing-border)]">
                  <SummaryRow
                    term="Timezone"
                    detail={timezoneLabel}
                    supporting={selectedTimezone}
                  />
                  <SummaryRow
                    term="Schedule image"
                    detail={fileName ?? "Not uploaded"}
                    supporting={fileName ? "Ready to read" : "Required"}
                  />
                  <div className="py-4">
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">
                      Color theme
                    </dt>
                    <dd className="mt-2 text-sm font-semibold">
                      {selectedPalette?.name ?? "Google default colors"}
                    </dd>
                    {selectedPalette && (
                      <Swatches
                        colors={selectedPalette.colors}
                        className="mt-3"
                      />
                    )}
                  </div>
                </dl>

                <div className="mt-2 rounded-2xl bg-[var(--landing-sage)] p-4 text-sm leading-6 text-[var(--landing-forest)]">
                  Google Calendar supports 11 event colors. Schedulr maps your
                  chosen palette to the closest available colors.
                </div>
              </div>
            </aside>
          </div>
        </form>
      </main>
    </div>
  );
}

function StepHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[42%_58%_55%_45%/54%_43%_57%_46%] bg-[var(--landing-sage)] text-sm font-semibold text-[var(--landing-forest)]">
        {number}
      </span>
      <div>
        <h2 className="text-xl font-semibold tracking-[-0.025em]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--landing-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  term,
  detail,
  supporting,
}: {
  term: string;
  detail: string;
  supporting: string;
}) {
  return (
    <div className="py-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">
        {term}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold">{detail}</dd>
      <dd className="mt-1 text-xs text-[var(--landing-muted)]">{supporting}</dd>
    </div>
  );
}

function Swatches({
  colors,
  className = "",
}: {
  colors: string[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} aria-hidden="true">
      {colors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className="h-6 w-6 rounded-full border border-black/10"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function BrandMark() {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-[42%_58%_55%_45%/54%_43%_57%_46%] bg-[var(--landing-forest)] text-white">
      <CalendarIcon />
    </span>
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

function ScheduleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3.5h8l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
      <path d="M15 3.5v4h4M9 12h6M9 15.5h6" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
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

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--landing-muted)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
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

function BackIcon() {
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
      <path d="M16 10H4M9 5l-5 5 5 5" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 animate-spin"
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
  );
}
