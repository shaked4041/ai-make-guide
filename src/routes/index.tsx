import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ListChecks, Sparkles, Zap, Workflow, ShieldCheck, Gauge } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import heroImage from "@/assets/hero-workflow.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  {
    icon: Workflow,
    title: "Module-by-module blueprint",
    description:
      "Get the exact Make.com modules in order, with configuration steps, required fields and data mapping for each one.",
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
      "Know roughly how many Make.com operations each run will consume — before you build it.",
  },
];

const steps = [
  { title: "Describe your automation", text: "Explain what you want in plain language — apps, triggers, outcomes." },
  { title: "AI designs the scenario", text: "Make Copilot turns it into a complete Make.com implementation plan." },
  { title: "Build it in Make.com", text: "Follow the step-by-step blueprint, module by module." },
];

function Landing() {
  const { session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-lg font-[family-name:var(--font-display)]">Make Copilot</span>
          </div>
          {session ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5" /> AI assistant for Make.com builders
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Describe the automation you want. Get a complete Make.com plan.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Make Copilot turns your goal into a step-by-step Make.com implementation plan — modules,
              configuration, logic, best practices and an operations estimate.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={session ? "/dashboard" : "/auth"}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                Create Automation <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-muted-foreground">Free to try · No Make.com account needed</span>
            </div>
          </div>
          <img
            src={heroImage}
            alt="Illustration of connected Make.com automation modules"
            width={1280}
            height={896}
            className="w-full rounded-2xl border border-border shadow-xl"
          />
        </section>

        {/* Features */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold md:text-3xl">Everything you need to build with confidence</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border border-border bg-background p-6">
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold md:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-xl border border-border bg-card p-6">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="rounded-2xl bg-hero px-6 py-14 text-center text-hero-foreground">
            <ListChecks className="mx-auto mb-4 h-8 w-8 opacity-80" />
            <h2 className="text-2xl font-bold md:text-3xl">Ready to plan your next automation?</h2>
            <p className="mx-auto mt-3 max-w-lg text-hero-foreground/80">
              Whether you're a freelancer, a business owner or learning Make.com — start with a solid plan.
            </p>
            <Link
              to={session ? "/dashboard" : "/auth"}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Create Automation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <p className="text-center text-sm text-muted-foreground">
          Make Copilot — AI planning assistant for Make.com. Not affiliated with Make.com.
        </p>
      </footer>
    </div>
  );
}
