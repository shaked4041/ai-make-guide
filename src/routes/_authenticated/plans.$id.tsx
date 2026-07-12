import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Loader2, Plus, FileText, Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/_authenticated/plans/$id")({
  component: PlanPage,
});

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-[oklch(0.78_0.16_258)]">{label}</span>
      <span className="text-sm text-white">{value}</span>
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
      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy plan"}
    </button>
  );
}

function PlanSkeleton() {
  return (
    <div className="mt-24">
      <div className="flex items-center justify-center gap-2 text-sm text-white/50">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading plan…
      </div>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 rounded bg-white/5" style={{ width: `${100 - i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

function PlanPage() {
  const { id } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const { data: request, error: reqError } = await supabase
        .from("automation_requests").select("*").eq("id", id).maybeSingle();
      if (reqError) throw reqError;
      const { data: plan, error: planError } = await supabase
        .from("generated_plans").select("*").eq("request_id", id).maybeSingle();
      if (planError) throw planError;
      return { request, plan };
    },
  });

  return (
    <PageShell>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All plans
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.07]"
          >
            <Plus className="h-3.5 w-3.5" /> New plan
          </Link>
        </div>

        {isLoading && <PlanSkeleton />}

        {(isError || (!isLoading && !data?.request)) && !isLoading && (
          <div className="mt-24 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
              <FileText className="h-5 w-5 text-white/50" strokeWidth={1.5} />
            </div>
            <p className="mt-4 font-medium text-white">Plan not found</p>
            <p className="mt-1 text-sm text-white/50">
              This automation plan doesn't exist or you don't have access.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/[0.08]"
            >
              <Plus className="h-3.5 w-3.5" /> Create plan
            </Link>
          </div>
        )}

        {data?.request && (
          <div className="animate-fade-in">
            {/* Document header */}
            <div className="mt-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70 backdrop-blur">
                <Sparkles className="h-3 w-3 text-[oklch(0.78_0.16_258)]" />
                Automation plan · {new Date(data.request.created_at).toLocaleDateString(undefined, {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </div>
              <h1 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-white md:text-[2rem]">
                {data.request.description}
              </h1>
            </div>

            {/* Meta */}
            <div
              className="relative mt-6 grid grid-cols-2 gap-x-6 gap-y-5 overflow-hidden rounded-2xl border border-white/10 p-5 backdrop-blur sm:grid-cols-4 sm:p-6"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.22 0.025 258 / 0.6) 0%, oklch(0.18 0.02 258 / 0.6) 100%)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-60"
                style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.16 258 / 0.7), transparent)" }}
              />
              <MetaItem label="For" value={data.request.user_type} />
              <MetaItem label="Level" value={data.request.experience_level} />
              <MetaItem label="Goal" value={data.request.main_goal} />
              <MetaItem label="Apps" value={data.request.apps_involved || "—"} />
            </div>

            {data.plan ? (
              <>
                <div className="mt-10 flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.78_0.16_258)]">
                    Implementation plan
                  </h2>
                  <CopyButton text={data.plan.content} />
                </div>
                <article
                  className="plan-content plan-content-dark relative mt-2 overflow-hidden rounded-2xl border border-white/10 p-6 backdrop-blur md:p-9"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.22 0.025 258 / 0.55) 0%, oklch(0.18 0.02 258 / 0.55) 100%)",
                  }}
                >
                  <ReactMarkdown>{data.plan.content}</ReactMarkdown>
                </article>
              </>
            ) : (
              <p className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-white/55">
                No plan was saved for this request. Try generating it again from the dashboard.
              </p>
            )}
          </div>
        )}
      </main>
    </PageShell>
  );
}
