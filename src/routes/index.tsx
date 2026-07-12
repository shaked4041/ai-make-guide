import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Workflow, ShieldCheck, Gauge, Sparkles, Check } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Logo } from "@/components/Logo";
import { WorkflowPreview } from "@/components/WorkflowPreview";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  {
    icon: Workflow,
    title: "Module-by-module blueprint",
    description:
      "The exact Make.com modules in order, with configuration steps, required fields and data mapping for each one.",
  },
  {
    icon: ShieldCheck,
    title: "Logic & error handling",
    description:
      "Filters, routers, conditions and error-handling recommendations so your scenario doesn't break in production.",
  },
  {
    icon: Gauge,
    title: "Operations estimate",
    description:
      "Know roughly how many Make.com operations each run will consume — before you build.",
  },
];

const steps = [
  { n: "01", title: "Describe your automation", text: "Explain what you want in plain language — apps, triggers, outcomes." },
  { n: "02", title: "AI drafts the scenario", text: "Make Copilot turns it into a complete Make.com implementation plan." },
  { n: "03", title: "Build it in Make.com", text: "Follow the step-by-step blueprint, module by module." },
];

function Landing() {
  const { session } = useSession();
  const ctaTo = session ? "/dashboard" : "/auth";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.16_0.02_258)] text-white/90 [color-scheme:dark]">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 45% at 75% 8%, oklch(0.55 0.2 258 / 0.25), transparent 60%), radial-gradient(50% 40% at 15% 40%, oklch(0.5 0.18 258 / 0.14), transparent 65%), linear-gradient(180deg, oklch(0.17 0.02 258) 0%, oklch(0.14 0.018 258) 100%)",
        }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[oklch(0.16_0.02_258)]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="text-white">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/55 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#how" className="transition-colors hover:text-white">How it works</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-1.5">
            {session ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-1.5 text-sm font-medium text-[oklch(0.18_0.02_258)] shadow-[0_1px_0_0_rgb(255_255_255/0.4)_inset,0_8px_20px_-8px_rgb(0_0_0/0.6)] transition-all hover:bg-white/90"
              >
                Dashboard <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="rounded-md px-3 py-1.5 text-sm text-white/70 transition-colors hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth"
                  className="group inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-1.5 text-sm font-medium text-[oklch(0.18_0.02_258)] shadow-[0_1px_0_0_rgb(255_255_255/0.4)_inset,0_8px_20px_-8px_rgb(0_0_0/0.6)] transition-all hover:bg-white/90"
                >
                  Get started <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero: split-screen */}
        <section className="relative border-b border-white/5">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[1.05fr_1fr] md:py-32">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70 backdrop-blur">
                <Sparkles className="h-3 w-3 text-[oklch(0.78_0.16_258)]" />
                AI planning assistant for Make.com
              </div>
              <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-white md:text-[3.6rem]">
                Build Make.com automations{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, oklch(0.98 0 0) 0%, oklch(0.75 0.15 258) 55%, oklch(0.6 0.2 258) 100%)",
                  }}
                >
                  faster with AI
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/60">
                Describe what you want to automate. Make Copilot returns a complete
                implementation plan — modules, configuration, data mapping, filters and
                an operations estimate.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={ctaTo}
                  className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[oklch(0.18_0.02_258)] shadow-[0_1px_0_0_rgb(255_255_255/0.5)_inset,0_12px_30px_-10px_rgb(0_0_0/0.7)] transition-all hover:-translate-y-0.5 hover:bg-white/95"
                >
                  Create your first plan
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-xs text-white/45">Free to try · No credit card</span>
              </div>
              <ul className="mt-10 grid gap-2 text-sm text-white/55 sm:grid-cols-2">
                {["Structured technical plans", "Data mapping included", "Best-practice logic", "Ops estimate per run"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[oklch(0.62_0.18_258)]/15 ring-1 ring-inset ring-[oklch(0.62_0.18_258)]/30">
                      <Check className="h-2.5 w-2.5 text-[oklch(0.82_0.14_258)]" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:pl-4">
              <WorkflowPreview />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative border-b border-white/5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 0%, oklch(0.5 0.18 258 / 0.08), transparent 70%)",
            }}
          />
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[oklch(0.78_0.16_258)]">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[2.5rem]">
                Everything you need to design a scenario with confidence
              </h2>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-40"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.78 0.16 258 / 0.6), transparent)",
                    }}
                  />
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[oklch(0.22_0.025_258)] text-[oklch(0.82_0.14_258)] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05)]">
                    <f.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="relative border-b border-white/5 bg-black/20">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[oklch(0.78_0.16_258)]">
                Workflow
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[2.5rem]">
                From idea to scenario in three steps
              </h2>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.n} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[oklch(0.78_0.16_258)]">{s.n}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight
                      className="pointer-events-none absolute -right-4 top-0 hidden h-4 w-4 text-white/20 md:block"
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 p-10 text-center md:p-16"
              style={{
                background:
                  "radial-gradient(80% 120% at 50% 0%, oklch(0.55 0.2 258 / 0.28), transparent 65%), linear-gradient(180deg, oklch(0.22 0.03 258) 0%, oklch(0.18 0.02 258) 100%)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                  maskImage:
                    "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                }}
              />
              <div className="relative">
                <h2 className="text-3xl font-semibold tracking-tight text-white md:text-[2.5rem]">
                  Plan your next automation
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-white/60">
                  For freelancers, business owners and teams shipping real Make.com scenarios.
                </p>
                <Link
                  to={ctaTo}
                  className="group mt-8 inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[oklch(0.18_0.02_258)] shadow-[0_1px_0_0_rgb(255_255_255/0.5)_inset,0_12px_30px_-10px_rgb(0_0_0/0.7)] transition-all hover:-translate-y-0.5"
                >
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-white/45 md:flex-row">
          <div className="text-white/70">
            <Logo />
          </div>
          <p>© {new Date().getFullYear()} Make Copilot. Not affiliated with Make.com.</p>
        </div>
      </footer>
    </div>
  );
}
