"use client";
export default function Home() {
  const handleClick = () => {
    window.location.href = "/api/google/auth";
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Top nav */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20" />
            <span className="text-lg font-semibold tracking-tight">CalSnap</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-300">
            <a className="hover:text-white transition-colors" href="#features">Features</a>
            <a className="hover:text-white transition-colors" href="#how">How it works</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]">
          <div className="absolute inset-x-0 top-[-10rem] h-[30rem] bg-gradient-to-b from-blue-500/30 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl/tight sm:text-5xl/tight font-semibold tracking-tight">
              Turn a schedule screenshot into a polished Google Calendar in minutes
            </h1>
            <p className="mt-4 text-slate-300 text-base/7 sm:text-lg/8">
              Upload, review, and sync. Clean design, clear steps, no clutter. Built with accessibility and modern UX in mind.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={handleClick}
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.99] transition"
                aria-label="Connect Google"
              >
                Connect with Google
              </button>
              <a
                href="#features"
                className="rounded-xl px-5 py-3 text-sm font-medium text-slate-200 ring-1 ring-white/15 hover:bg-white/5 transition"
              >
                Learn more
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl ring-1 ring-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl shadow-black/40">
              <div className="aspect-[16/10] rounded-xl bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.35),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.3),transparent_45%)] ring-1 ring-white/10" />
            </div>
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-cyan-500/10 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Clean & focused",
              desc: "Minimal UI that keeps you in flow with clear hierarchy and spacing.",
            },
            {
              title: "Accessible by default",
              desc: "Color contrast, focus states, and keyboard-friendly interactions.",
            },
            {
              title: "Smooth microinteractions",
              desc: "Subtle motion that guides—not distracts—across actions and states.",
            },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl ring-1 ring-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 mb-4 opacity-80 group-hover:opacity-100 transition" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} CalSnap. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
