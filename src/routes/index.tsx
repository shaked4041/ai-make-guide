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
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            {session ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Sign in
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero: split-screen */}
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-[1.05fr_1fr] md:py-28">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                AI planning assistant for Make.com
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-[3.25rem]">
                Build Make.com automations faster with AI
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Describe what you want to automate. Make Copilot returns a complete
                implementation plan — modules, configuration, data mapping, filters and
                an operations estimate.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={ctaTo}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                >
                  Create your first plan <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs text-muted-foreground">Free to try · No credit card</span>
              </div>
              <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {["Structured technical plans", "Data mapping included", "Best-practice logic", "Ops estimate per run"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-foreground" />
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
        <section id="features" className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Features</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Everything you need to design a scenario with confidence
              </h2>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="bg-card p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground">
                    <f.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Workflow</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                From idea to scenario in three steps
              </h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="border-t border-border pt-5">
                  <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="rounded-2xl border border-border bg-surface p-10 text-center md:p-14">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Plan your next automation
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                For freelancers, business owners and teams shipping real Make.com scenarios.
              </p>
              <Link
                to={ctaTo}
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Make Copilot. Not affiliated with Make.com.</p>
        </div>
      </footer>
    </div>
  );
}
