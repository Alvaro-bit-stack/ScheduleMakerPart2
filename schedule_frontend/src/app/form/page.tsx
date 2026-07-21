"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Loading from "./loading";

type Palette = {
  name: string;
  colors: string[];
  image?: string;
};

// Color themes. `colors` drive the actual Google Calendar event colors; each
// class cycles through the palette so your schedule reflects the theme.
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
  { label: "America/New_York", value: "America/New_York" },
  { label: "America/Chicago", value: "America/Chicago" },
  { label: "America/Denver", value: "America/Denver" },
  { label: "America/Los_Angeles", value: "America/Los_Angeles" },
  { label: "Europe/London", value: "Europe/London" },
  { label: "Asia/Tokyo", value: "Asia/Tokyo" },
];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

function FormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  const [status, setStatus] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken) localStorage.setItem("google_access_token", accessToken);
    if (refreshToken)
      localStorage.setItem("google_refresh_token", refreshToken);

    if (accessToken || refreshToken) {
      router.replace("/form");
    }
  }, [searchParams, router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
      setFileType(file.type);
    };
    reader.readAsDataURL(file);
  }

  const handleMissingToken = () => {
    window.location.href = "/api/google/auth";
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const userToken = localStorage.getItem("google_access_token");
    const refreshToken = localStorage.getItem("google_refresh_token");

    if (!userToken || !refreshToken) {
      handleMissingToken();
      return;
    }

    if (!formData.get("fileUpload") || !(formData.get("fileUpload") as File).size) {
      setStatus({ kind: "error", message: "Please upload a schedule image first." });
      return;
    }

    formData.append("user_token", userToken);
    formData.append("refresh_token", refreshToken);

    // Send the full palette (name + colors) so the backend can map the theme
    // to Google Calendar event colors.
    if (selectedPalette) {
      formData.append("palette", JSON.stringify(selectedPalette));
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed (${res.status})`);

      const data = await res.json();
      const count = Array.isArray(data.classes) ? data.classes.length : 0;
      setStatus({
        kind: "success",
        message: `Synced ${count} class${count === 1 ? "" : "es"} to your Google Calendar${
          selectedPalette ? ` in the ${selectedPalette.name} theme` : ""
        }.`,
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error
            ? `${err.message}. Is the backend running at ${BACKEND_URL}?`
            : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <form
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 px-6 py-10"
      onSubmit={handleSubmit}
      aria-labelledby="formTitle"
    >
      <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-2">
        {/* Left column: steps */}
        <div className="space-y-6">
          <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.03] p-6">
            <h1 id="formTitle" className="text-2xl font-semibold tracking-tight">
              Setup your calendar
            </h1>
            <p className="mt-2 text-slate-300 text-sm">
              Follow the steps and submit to sync to Google Calendar.
            </p>

            <ol className="mt-6 space-y-6 text-sm">
              {/* Step 1: timezone */}
              <li className="flex gap-3 items-start">
                <StepBadge n={1} />
                <div className="w-full">
                  <div className="font-medium">Choose your timezone</div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIMEZONES.map((tz, i) => (
                      <label
                        key={tz.value}
                        className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-slate-200 hover:bg-white/[0.05] transition cursor-pointer has-[:checked]:border-blue-400/60 has-[:checked]:bg-blue-500/10"
                      >
                        <input
                          type="radio"
                          name="timezone"
                          value={tz.value}
                          defaultChecked={i === 0}
                          className="accent-blue-500"
                        />
                        <span className="text-sm">{tz.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </li>

              {/* Step 2: upload */}
              <li className="flex gap-3 items-start">
                <StepBadge n={2} />
                <div className="w-full">
                  <div className="font-medium">Upload your schedule screenshot</div>
                  <label htmlFor="fileUpload" className="mt-2 block text-slate-300">
                    Choose your file:
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    name="fileUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                  />
                  {previewUrl && fileType?.startsWith("image/") && (
                    <div className="mt-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Schedule preview"
                        className="max-w-xs rounded-xl ring-1 ring-white/10 shadow-lg"
                      />
                    </div>
                  )}
                </div>
              </li>

              {/* Step 3: color theme */}
              <li className="flex gap-3 items-start">
                <StepBadge n={3} />
                <div className="w-full">
                  <div className="font-medium">Pick a color theme</div>
                  <p className="mt-1 text-slate-400 text-xs">
                    Your classes cycle through these colors on Google Calendar.
                  </p>
                  <div
                    className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3"
                    role="radiogroup"
                    aria-label="Color theme"
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
                          className={`text-left rounded-xl p-3 ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                            selected
                              ? "ring-blue-400/70 bg-blue-500/10"
                              : "ring-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{palette.name}</span>
                            {selected && (
                              <span className="text-[11px] text-blue-300">Selected</span>
                            )}
                          </div>
                          <Swatches colors={palette.colors} className="mt-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </li>
            </ol>

            {status && (
              <p
                role="status"
                className={`mt-6 rounded-xl px-4 py-3 text-sm ring-1 ${
                  status.kind === "success"
                    ? "bg-emerald-500/10 text-emerald-200 ring-emerald-400/30"
                    : "bg-rose-500/10 text-rose-200 ring-rose-400/30"
                }`}
              >
                {status.message}
              </p>
            )}

            <div className="mt-8">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.99] transition"
              >
                Submit &amp; Sync
              </button>
            </div>
          </div>
        </div>

        {/* Right column: summary card */}
        <aside className="space-y-6">
          <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-10">
            <h2 className="text-lg font-semibold">What you&apos;ll get</h2>
            <p className="mt-2 text-sm text-slate-300">
              A clean set of events added to your Google Calendar with your chosen
              theme colors and correct recurrence.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-3">
                <div className="text-slate-400">Selected theme</div>
                <div className="mt-1 font-medium">
                  {selectedPalette?.name ?? "None (default colors)"}
                </div>
                {selectedPalette && (
                  <Swatches colors={selectedPalette.colors} className="mt-2" />
                )}
              </div>
              <div className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-3">
                <div className="text-slate-400">Schedule image</div>
                <div className="mt-1 font-medium">
                  {previewUrl ? "Ready" : "Not uploaded yet"}
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Google Calendar supports 11 event colors, so each theme color maps to
              the closest one.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
      {n}
    </span>
  );
}

function Swatches({ colors, className = "" }: { colors: string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {colors.map((c, i) => (
        <span
          key={`${c}-${i}`}
          title={c}
          className="h-5 w-5 rounded-full ring-1 ring-white/20"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

export default function Form() {
  // useSearchParams requires a Suspense boundary in the Next.js app router.
  return (
    <Suspense fallback={<Loading />}>
      <FormInner />
    </Suspense>
  );
}
