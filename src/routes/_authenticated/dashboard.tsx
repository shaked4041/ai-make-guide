import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowRight, Clock, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generatePlan } from "@/lib/plans.functions";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const USER_TYPES = ["My own business", "A client", "Learning / practice"] as const;
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const GOALS = ["Save time", "Reduce manual work", "Connect apps", "Generate leads", "Other"] as const;

function OptionPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={
            opt === value
              ? "rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
              : "rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          }
        >
          {opt}
        </button>
      ))}
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
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold md:text-3xl">Plan a new automation</h1>
        <p className="mt-1 text-muted-foreground">
          Describe what you want to build and get a complete Make.com implementation plan.
        </p>

        <form
          className="mt-8 space-y-6 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) mutation.mutate();
          }}
        >
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-semibold">
              Automation description
            </label>
            <textarea
              id="description"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='e.g. "When a new Typeform response arrives, create a HubSpot contact and send a Slack notification."'
              className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Who is this automation for?</p>
            <OptionPills options={USER_TYPES} value={userType} onChange={setUserType} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Experience level</p>
            <OptionPills options={EXPERIENCE_LEVELS} value={experience} onChange={setExperience} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Main goal</p>
            <OptionPills options={GOALS} value={goal} onChange={setGoal} />
            {goal === "Other" && (
              <input
                type="text"
                maxLength={120}
                value={otherGoal}
                onChange={(e) => setOtherGoal(e.target.value)}
                placeholder="Describe your goal"
                className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              />
            )}
          </div>

          <div>
            <label htmlFor="apps" className="mb-1.5 block text-sm font-semibold">
              Apps involved <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="apps"
              type="text"
              maxLength={300}
              value={apps}
              onChange={(e) => setApps(e.target.value)}
              placeholder="e.g. Gmail, HubSpot, Google Sheets, Slack"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">
              {mutation.error instanceof Error ? mutation.error.message : "Something went wrong. Please try again."}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating your plan… this can take up to a minute
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate plan
              </>
            )}
          </button>
        </form>

        {/* Recent automations */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Previous automations</h2>
            <Link to="/history" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recent && recent.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No automations yet — generate your first plan above.
              </p>
            )}
            {recent?.map((r) => (
              <Link
                key={r.id}
                to="/plans/$id"
                params={{ id: r.id }}
                className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-ring"
              >
                <p className="line-clamp-2 text-sm font-medium">{r.description}</p>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
