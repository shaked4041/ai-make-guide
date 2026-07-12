import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";

export function AppHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const linkBase =
    "rounded-md px-2.5 py-1.5 text-sm text-white/55 transition-colors hover:text-white";
  const linkActive =
    "rounded-md px-2.5 py-1.5 text-sm text-white font-medium";

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[oklch(0.16_0.02_258)]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-white">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/dashboard" className={linkBase} activeProps={{ className: linkActive }}>
              Dashboard
            </Link>
            <Link to="/history" className={linkBase} activeProps={{ className: linkActive }}>
              History
            </Link>
          </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </header>
  );
}
