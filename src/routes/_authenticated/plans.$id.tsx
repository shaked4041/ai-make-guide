import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Loader2, Plus, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_authenticated/plans/$id")({
  component: PlanPage,
});

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch { /* noop */ }
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy plan"}
    </button>
  );
}

function PlanPage() {
  const { id } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const { data: request, error: reqError } = await supabase
        .from("automation_requests")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (reqError) throw reqError;
      const { data: plan, error: planError } = await supabase
        .from("generated_plans")
        .select("*")
        .eq("request_id", id)
        .maybeSingle();
      if (planError) throw planError;
      return { request, plan };
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All plans
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            <Plus className="h-3.5 w-3.5" /> New plan
          </Link>
        </div>

        {isLoading && (
          <div className="mt-24 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading plan…
          </div>
        )}

        {(isError || (!isLoading && !data?.request)) && !isLoading && (
          <div className="mt-24 text-center">
            <FileText className="mx-auto h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-3 font-medium">Plan not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This automation plan doesn't exist or you don't have access.
            </p>
          </div>
        )}

        {data?.request && (
          <>
            {/* Document header */}
            <div className="mt-8">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Plan · {new Date(data.request.created_at).toLocaleDateString(undefined, {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </p>
              <h1 className="mt-2 text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
                {data.request.description}
              </h1>
            </div>

            {/* Meta */}
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-4">
              <MetaItem label="For" value={data.request.user_type} />
              <MetaItem label="Level" value={data.request.experience_level} />
              <MetaItem label="Goal" value={data.request.main_goal} />
              <MetaItem label="Apps" value={data.request.apps_involved || "—"} />
            </div>

            {data.plan ? (
              <>
                <div className="mt-8 flex items-center justify-between border-b border-border pb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Implementation plan
                  </h2>
                  <CopyButton text={data.plan.content} />
                </div>
                <article className="plan-content mt-2 rounded-xl border border-border bg-card p-6 md:p-8">
                  <ReactMarkdown>{data.plan.content}</ReactMarkdown>
                </article>
              </>
            ) : (
              <p className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No plan was saved for this request. Try generating it again from the dashboard.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
