import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function HistoryPage() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["all-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automation_requests")
        .select("id, description, user_type, experience_level, main_goal, apps_involved, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("automation_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-requests"] });
      queryClient.invalidateQueries({ queryKey: ["recent-requests"] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Library</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">History</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              All automation plans you've generated.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> New plan
          </Link>
        </div>

        {isLoading && (
          <div className="mt-16 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        )}

        {requests && requests.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-border p-14 text-center">
            <FileText className="mx-auto h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium">No automations yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Generate your first plan from the dashboard.</p>
          </div>
        )}

        {requests && requests.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border bg-surface px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <div>Description</div>
              <div className="hidden md:block">Goal</div>
              <div>Date</div>
              <div className="sr-only">Actions</div>
            </div>
            <ul>
              {requests.map((r, i) => (
                <li
                  key={r.id}
                  className={`group grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface md:grid-cols-[1fr_auto_auto_auto] ${
                    i !== 0 ? "border-t border-border" : ""
                  }`}
                >
                  <Link to="/plans/$id" params={{ id: r.id }} className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">{r.description}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{r.user_type}</span>
                      <span className="text-border-strong">·</span>
                      <span>{r.experience_level}</span>
                      {r.apps_involved && (
                        <>
                          <span className="text-border-strong">·</span>
                          <span className="line-clamp-1">{r.apps_involved}</span>
                        </>
                      )}
                    </div>
                  </Link>
                  <span className="hidden shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted-foreground md:block">
                    {r.main_goal}
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                    {formatDate(r.created_at)}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm("Delete this automation plan?")) deleteMutation.mutate(r.id);
                    }}
                    aria-label="Delete automation"
                    className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
