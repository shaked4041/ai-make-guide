import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_authenticated/plans/$id")({
  component: PlanPage,
});

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
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> History
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New automation
          </Link>
        </div>

        {isLoading && (
          <div className="mt-20 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading plan…
          </div>
        )}

        {(isError || (!isLoading && !data?.request)) && !isLoading && (
          <div className="mt-20 text-center">
            <p className="font-medium">Plan not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This automation plan doesn't exist or you don't have access to it.
            </p>
          </div>
        )}

        {data?.request && (
          <>
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your request</p>
              <h1 className="mt-2 text-lg font-semibold">{data.request.description}</h1>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                  For: {data.request.user_type}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                  Level: {data.request.experience_level}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                  Goal: {data.request.main_goal}
                </span>
                {data.request.apps_involved && (
                  <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                    Apps: {data.request.apps_involved}
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Generated {new Date(data.request.created_at).toLocaleString()}
              </p>
            </div>

            {data.plan ? (
              <article className="plan-content mt-8 rounded-xl border border-border bg-card p-6 md:p-8">
                <ReactMarkdown>{data.plan.content}</ReactMarkdown>
              </article>
            ) : (
              <p className="mt-8 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No plan was saved for this request. Try generating it again from the dashboard.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
