import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function HistoryPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    if (!requests) return [];
    const q = query.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) =>
      [r.description, r.apps_involved, r.main_goal, r.user_type]
        .filter(Boolean)
        .some((v) => v!.toString().toLowerCase().includes(q))
    );
  }, [requests, query]);

  return (
    <PageShell>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="animate-fade-in">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[oklch(0.78_0.16_258)]">Library</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">History</h1>
            <p className="mt-2 text-sm text-white/55">Every automation plan you've generated.</p>
          </div>
          <Link
            to="/dashboard"
            className="group inline-flex items-center justify-center gap-1.5 rounded-md bg-white px-4 py-2 text-sm font-medium text-[oklch(0.18_0.02_258)] shadow-[0_1px_0_0_rgb(255_255_255/0.5)_inset,0_12px_30px_-10px_rgb(0_0_0/0.7)] transition-all hover:-translate-y-0.5 hover:bg-white/95"
          >
            <Plus className="h-3.5 w-3.5" /> New plan
          </Link>
        </div>

        {/* Search */}
        <div className="relative mt-8">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by description, app, or goal…"
            className="w-full rounded-md border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-[oklch(0.62_0.18_258)]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[oklch(0.62_0.18_258)]/20"
          />
        </div>

        {isLoading && (
          <div className="mt-16 flex items-center justify-center gap-2 text-sm text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        )}

        {!isLoading && requests && requests.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-14 text-center backdrop-blur">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
              <FileText className="h-5 w-5 text-white/50" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-sm font-medium text-white">No automations yet</p>
            <p className="mt-1 text-sm text-white/50">Generate your first plan from the dashboard.</p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/[0.08]"
            >
              <Plus className="h-3.5 w-3.5" /> Create plan
            </Link>
          </div>
        )}

        {!isLoading && requests && requests.length > 0 && (
          <>
            {filtered.length === 0 ? (
              <p className="mt-10 text-center text-sm text-white/50">No plans match "{query}".</p>
            ) : (
              <ul className="mt-8 grid gap-3">
                {filtered.map((r) => (
                  <li
                    key={r.id}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity group-hover:opacity-60"
                      style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.16 258 / 0.7), transparent)" }}
                    />
                    <Link
                      to="/plans/$id"
                      params={{ id: r.id }}
                      className="flex items-start gap-4 p-5"
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[oklch(0.82_0.14_258)]">
                        <FileText className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[15px] font-medium text-white">{r.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/60">{r.main_goal}</span>
                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/60">{r.experience_level}</span>
                          {r.apps_involved && (
                            <span className="line-clamp-1 max-w-xs rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/60">
                              {r.apps_involved}
                            </span>
                          )}
                          <span className="ml-auto text-xs text-white/40">{formatDate(r.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Delete this automation plan?")) deleteMutation.mutate(r.id);
                      }}
                      aria-label="Delete automation"
                      className="absolute right-3 top-3 rounded-md p-1.5 text-white/40 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </PageShell>
  );
}
