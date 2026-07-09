import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

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
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">History</h1>
            <p className="mt-1 text-muted-foreground">All your generated automation plans.</p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New
          </Link>
        </div>

        {isLoading && (
          <div className="mt-20 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading…
          </div>
        )}

        {requests && requests.length === 0 && (
          <p className="mt-12 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No automations yet. Generate your first plan from the dashboard.
          </p>
        )}

        <div className="mt-8 space-y-3">
          {requests?.map((r) => (
            <div
              key={r.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-ring"
            >
              <Link to="/plans/$id" params={{ id: r.id }} className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium">{r.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-secondary-foreground">{r.user_type}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-secondary-foreground">{r.experience_level}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-secondary-foreground">{r.main_goal}</span>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </Link>
              <button
                onClick={() => {
                  if (confirm("Delete this automation plan?")) deleteMutation.mutate(r.id);
                }}
                aria-label="Delete automation"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
