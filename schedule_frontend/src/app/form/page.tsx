"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loading from "./loading";
import CircularGallery from "./CircularGallery";

export default function Form() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);

  // Example palettes
  const palettes = [
    {
      name: "Howls Moving Castle",
      colors: [
        "#102f49",
        "#754957",
        "#274d6f",
        "#c97234",
        "#5981a7",
        "#ffca5d",
      ],
      image: "/PalletesPhotos/HowlsMovingCastle.png",
    },
    {
      name: "Ponyo",
      colors: [
        "#27456c",
        "#47748b",
        "#99bfd5",
        "#eccca6",
        "#e95c6c",
        "#f7a088",
      ],
      image: "PalletesPhotos/ponyo.png",
    },
    {
      name: "Spirited Away",
      colors: [
        "#59a9a1",
        "#3a7171",
        "#cae0ec",
        "#91b0bd",
        "#163352",
        "#c5b0cd",
      ],
    },
    {
      name: "Matcha",
      colors: ["#A5AA70", "#AAA18F", "#C6BDA7", "#9CAF88", "#7A8450"],
    },
  ];

  const palettesName = palettes.map((p) => p.name);
  const palettesColors = palettes.map((p) => p.colors);
  const palettesImages = palettes.map((p) => p.image);

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
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const userToken = localStorage.getItem("google_access_token");
    const refreshToken = localStorage.getItem("google_refresh_token");

    if (userToken && refreshToken) {
      formData.append("user_token", userToken);
      formData.append("refresh_token", refreshToken);
    } else {
      handleMissingToken();
      return;
    }

    if (selectedPalette) {
      formData.append("palette", selectedPalette);
    }

    try {
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("✅ Upload success:", data);
    } catch (err) {
      console.error("❌ Error uploading:", err);
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
            <h1
              id="formTitle"
              className="text-2xl font-semibold tracking-tight"
            >
              Setup your calendar
            </h1>
            <p className="mt-2 text-slate-300 text-sm">
              Follow the steps and submit to sync to Google Calendar.
            </p>
            <ol className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                  1
                </span>
                <div>
                  <div className="font-medium">Choose your timezone</div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: "America/New_York", value: "America/New_York" },
                      { label: "Europe/London", value: "Europe/London" },
                      { label: "Asia/Tokyo", value: "Asia/Tokyo" },
                    ].map((tz) => (
                      <label
                        key={tz.value}
                        className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2 text-slate-200 hover:bg-white/[0.05] transition"
                      >
                        <input
                          type="radio"
                          name="timezone"
                          value={tz.value}
                          className="accent-blue-500"
                        />
                        <span className="text-sm">{tz.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                  2
                </span>
                <div className="w-full">
                  <div className="font-medium">
                    Upload your schedule screenshot
                  </div>
                  <label
                    htmlFor="fileUpload"
                    className="mt-2 block text-slate-300"
                  >
                    Choose your file:
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    name="fileUpload"
                    onChange={handleFileChange}
                    className="mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                  />
                  {previewUrl && (
                    <div className="mt-4">
                      {fileType?.startsWith("image/") && (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-xs rounded-xl ring-1 ring-white/10 shadow-lg"
                        />
                      )}
                      {fileType?.startsWith("video/") && (
                        <video
                          src={previewUrl}
                          controls
                          className="max-w-xs rounded-xl ring-1 ring-white/10 shadow-lg"
                        />
                      )}
                    </div>
                  )}
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                  3
                </span>
                <div className="w-full">
                  <div className="font-medium">Pick a color theme</div>
                  <div className="mt-3 h-[360px] w-full relative">
                    <CircularGallery
                      bend={3}
                      textColor="#fff"
                      borderRadius={0.05}
                      scrollEase={0.02}
                      items={palettesName.map((name, index) => ({
                        image: palettesImages[index] ?? "",
                        text: name,

                      }))}
                      onItemClick={(item, index) => {
                        setSelectedPalette(item.text);
                        console.log('Clicked item:', item, 'at index:', index);
                      }}
                    />
                  </div>
                  {selectedPalette && (
                    <p className="mt-2 text-sm text-slate-300">
                      Selected: {selectedPalette}
                    </p>
                  )}
                </div>
              </li>
            </ol>
            <div className="mt-8">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.99] transition"
              >
                Submit & Sync
              </button>
            </div>
          </div>
        </div>

        {/* Right column: summary card */}
        <aside className="space-y-6">
          <div className="rounded-2xl ring-1 ring-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">What you'll get</h2>
            <p className="mt-2 text-sm text-slate-300">
              A clean set of events added to your Google Calendar with your
              chosen colors and correct recurrence.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Timezone", value: "Selected above" },
                { label: "Palette", value: selectedPalette ?? "None" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-3"
                >
                  <div className="text-slate-400">{row.label}</div>
                  <div className="mt-1 font-medium">{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
