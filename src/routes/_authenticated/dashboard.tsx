import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowRight, Clock, Loader2, Sparkles, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generatePlan } from "@/lib/plans.functions";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const USER_TYPES = ["My own business", "A client", "Learning / practice"] as const;
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const GOALS = ["Save time", "Reduce manual work", "Connect apps", "Generate leads", "Other"] as const;

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-md border border-border bg-surface p-1">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              active
                ? "rounded-[5px] bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-[var(--shadow-subtle)]"
                : "rounded-[5px] px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
      <label className="text-sm font-medium text-foreground">{children}</label>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
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

  const { data: recent } = useQuery({
    queryKey: ["recent-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automation_requests")
        .select("id, description, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const canSubmit = description.trim().length >= 10 && !mutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Workspace</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">New automation</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Describe the automation you want to build. Get a complete Make.com plan.
            </p>
          </div>
        </div>

        <form
          className="mt-8 rounded-xl border border-border bg-card shadow-[var(--shadow-card)]"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) mutation.mutate();
          }}
        >
          {/* Prompt */}
          <div className="border-b border-border p-5">
            <FieldLabel hint={`${description.length}/2000`}>What should this automation do?</FieldLabel>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='e.g. "When a new Typeform response arrives, create a HubSpot contact and send a Slack notification to #sales."'
              className="w-full resize-y rounded-md border-0 bg-transparent p-0 text-[15px] leading-relaxed placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Context */}
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
                  type="text"
                  maxLength={120}
                  value={otherGoal}
                  onChange={(e) => setOtherGoal(e.target.value)}
                  placeholder="Describe your goal"
                  className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              )}
            </div>
            <div className="sm:col-span-2">
              <FieldLabel hint="Optional">Apps involved</FieldLabel>
              <input
                type="text"
                maxLength={300}
                value={apps}
                onChange={(e) => setApps(e.target.value)}
                placeholder="Gmail, HubSpot, Google Sheets, Slack…"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          {/* Action bar */}
          <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border bg-surface/60 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Generation typically takes 20–60 seconds.
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Drafting plan…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate plan
                </>
              )}
            </button>
          </div>
        </form>

        {mutation.isError && (
          <p className="mt-3 text-sm text-destructive">
            {mutation.error instanceof Error ? mutation.error.message : "Something went wrong. Please try again."}
          </p>
        )}

        {/* Recent */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent</h2>
            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
            {recent && recent.length === 0 && (
              <div className="p-10 text-center">
                <FileText className="mx-auto h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium">No automations yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Generate your first plan above.</p>
              </div>
            )}
            {recent?.map((r, i) => (
              <Link
                key={r.id}
                to="/plans/$id"
                params={{ id: r.id }}
                className={`group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface ${
                  i !== 0 ? "border-t border-border" : ""
                }`}
              >
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                <p className="line-clamp-1 flex-1 text-sm text-foreground">{r.description}</p>
                <p className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                  <Clock className="h-3 w-3" />
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
