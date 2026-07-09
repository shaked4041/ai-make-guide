import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function AppHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <span className="font-[family-name:var(--font-display)]">Make Copilot</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            activeProps={{ className: "rounded-md px-3 py-1.5 bg-secondary text-secondary-foreground font-medium" }}
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            activeProps={{ className: "rounded-md px-3 py-1.5 bg-secondary text-secondary-foreground font-medium" }}
          >
            History
          </Link>
          <button
            onClick={handleSignOut}
            className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
