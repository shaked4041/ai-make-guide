import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowRight, Clock, Loader2, Sparkles, FileText, Zap, Layers, Workflow } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generatePlan } from "@/lib/plans.functions";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const USER_TYPES = ["My own business", "A client", "Learning / practice"] as const;
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const GOALS = ["Save time", "Reduce manual work", "Connect apps", "Generate leads", "Other"] as const;

const EXAMPLES = [
  { icon: Zap, text: "New Typeform response → HubSpot contact + Slack alert to #sales" },
  { icon: Layers, text: "Every Monday, summarize last week's Stripe payments into a Notion page" },
  { icon: Workflow, text: "New Shopify order → Google Sheets row + branded email via Gmail" },
];

function Segmented<T extends string>({
  options, value, onChange,
}: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              active
                ? "rounded-md bg-white/[0.08] px-3 py-1.5 text-sm font-medium text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06)]"
                : "rounded-md px-3 py-1.5 text-sm text-white/55 transition-colors hover:text-white"
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <label className="text-[13px] font-medium text-white/80">{children}</label>
      {hint && <span className="text-xs text-white/40">{hint}</span>}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const generate = useServerFn(generatePlan);

  const [description, setDescription] = useState("");
  const [userType, setUserType] = useState<(typeof USER_TYPES)[number]>("My own business");
  const [experience, setExperience] = useState<(typeof EXPERIENCE_LEVELS)[number]>("Beginner");
  const [goal, setGoal] = useState<(typeof GOALS)[number]>("Save time");
  const [otherGoal, setOtherGoal] = useState("");
  const [apps, setApps] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      generate({
        data: {
          description,
          userType,
          experienceLevel: experience,
          mainGoal: goal === "Other" ? otherGoal.trim() || "Other" : goal,
          appsInvolved: apps.trim() || undefined,
        },
      }),
    onSuccess: (result) => {
      navigate({ to: "/plans/$id", params: { id: result.requestId } });
    },
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ["recent-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automation_requests")
        .select("id, description, apps_involved, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const canSubmit = description.trim().length >= 10 && !mutation.isPending;
  const inputCls =
    "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[oklch(0.62_0.18_258)]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[oklch(0.62_0.18_258)]/20";

  return (
    <PageShell>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70 backdrop-blur">
            <Sparkles className="h-3 w-3 text-[oklch(0.78_0.16_258)]" />
            AI planning assistant
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            What should we automate today?
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Describe your workflow in plain language. Make Copilot returns a full implementation plan.
          </p>
        </div>

        {/* Prompt card */}
        <form
          className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] backdrop-blur-xl animate-fade-in"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.22 0.025 258 / 0.7) 0%, oklch(0.18 0.02 258 / 0.7) 100%)",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) mutation.mutate();
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-60"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.16 258 / 0.7), transparent)" }}
          />

          <div className="border-b border-white/5 p-5">
            <FieldLabel hint={`${description.length}/2000`}>Describe your automation</FieldLabel>
            <textarea
              required minLength={10} maxLength={2000} rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='e.g. "When a new Typeform response arrives, create a HubSpot contact and send a Slack notification to #sales."'
              className="w-full resize-y bg-transparent p-0 text-[15px] leading-relaxed text-white placeholder:text-white/30 focus:outline-none"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.text}
                  type="button"
                  onClick={() => setDescription(ex.text)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <ex.icon className="h-3 w-3 text-[oklch(0.78_0.16_258)]" strokeWidth={1.8} />
                  <span className="line-clamp-1 max-w-[22rem]">{ex.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2">
            <div>
              <FieldLabel>Who is this for?</FieldLabel>
              <Segmented options={USER_TYPES} value={userType} onChange={setUserType} />
            </div>
            <div>
              <FieldLabel>Experience level</FieldLabel>
              <Segmented options={EXPERIENCE_LEVELS} value={experience} onChange={setExperience} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Main goal</FieldLabel>
              <Segmented options={GOALS} value={goal} onChange={setGoal} />
              {goal === "Other" && (
                <input
                  type="text" maxLength={120}
                  value={otherGoal} onChange={(e) => setOtherGoal(e.target.value)}
                  placeholder="Describe your goal"
                  className={`${inputCls} mt-3`}
                />
              )}
            </div>
            <div className="sm:col-span-2">
              <FieldLabel hint="Optional">Apps involved</FieldLabel>
              <input
                type="text" maxLength={300}
                value={apps} onChange={(e) => setApps(e.target.value)}
                placeholder="Gmail, HubSpot, Google Sheets, Slack…"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse items-stretch gap-3 border-t border-white/5 bg-white/[0.02] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/45">Generation typically takes 20–60 seconds.</p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-[oklch(0.18_0.02_258)] shadow-[0_1px_0_0_rgb(255_255_255/0.5)_inset,0_12px_30px_-10px_rgb(0_0_0/0.7)] transition-all hover:-translate-y-0.5 hover:bg-white/95 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {mutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Drafting plan…</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generate plan</>
              )}
            </button>
          </div>
        </form>

        {mutation.isError && (
          <p className="mt-3 text-sm text-red-400">
            {mutation.error instanceof Error ? mutation.error.message : "Something went wrong. Please try again."}
          </p>
        )}

        {/* Recent */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.78_0.16_258)]">Recent</h2>
            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-sm text-white/55 transition-colors hover:text-white"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur">
            {recentLoading && (
              <div className="divide-y divide-white/5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="h-4 w-4 rounded bg-white/5" />
                    <div className="h-3 flex-1 rounded bg-white/5" />
                    <div className="h-3 w-16 rounded bg-white/5" />
                  </div>
                ))}
              </div>
            )}
            {!recentLoading && recent && recent.length === 0 && (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <FileText className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-sm font-medium text-white">No automations yet</p>
                <p className="mt-1 text-sm text-white/50">Generate your first plan above.</p>
              </div>
            )}
            {recent?.map((r, i) => (
              <Link
                key={r.id}
                to="/plans/$id"
                params={{ id: r.id }}
                className={`group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.04] ${
                  i !== 0 ? "border-t border-white/5" : ""
                }`}
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-[oklch(0.82_0.14_258)]">
                  <FileText className="h-3.5 w-3.5" strokeWidth={1.6} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm text-white">{r.description}</p>
                  {r.apps_involved && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/45">{r.apps_involved}</p>
                  )}
                </div>
                <p className="hidden shrink-0 items-center gap-1 text-xs text-white/45 sm:flex">
                  <Clock className="h-3 w-3" />
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
