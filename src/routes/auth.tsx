import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSession } from "@/hooks/use-session";
import { Logo } from "@/components/Logo";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Make Copilot" },
      { name: "description", content: "Sign in or create an account to start generating Make.com automation plans." },
      { property: "og:title", content: "Sign in — Make Copilot" },
      { property: "og:description", content: "Sign in or create an account to start generating Make.com automation plans." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionLoading && session) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [session, sessionLoading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError(err.message); return; }
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error: err } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) { setError(err.message); return; }
        setNotice("Account created. Check your email to confirm, then sign in.");
        setMode("login");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  const inputCls =
    "w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[oklch(0.62_0.18_258)]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[oklch(0.62_0.18_258)]/20";

  return (
    <PageShell>
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          <Link to="/" className="mb-8 flex justify-center text-white">
            <Logo size="md" />
          </Link>

          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 p-7 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.22 0.025 258 / 0.7) 0%, oklch(0.18 0.02 258 / 0.7) 100%)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.16 258 / 0.7), transparent)",
              }}
            />
            <h1 className="text-lg font-semibold text-white">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-white/55">
              {mode === "login"
                ? "Sign in to generate Make.com automation plans."
                : "Sign up to start planning your automations."}
            </p>

            <button
              onClick={handleGoogle}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.07]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a7.2 7.2 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-white/40">
              <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">Email</label>
                <input
                  id="email" type="email" required maxLength={255}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputCls} placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">Password</label>
                <input
                  id="password" type="password" required minLength={6} maxLength={72}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className={inputCls} placeholder="••••••••"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              {notice && <p className="text-sm text-[oklch(0.82_0.14_258)]">{notice}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[oklch(0.18_0.02_258)] shadow-[0_1px_0_0_rgb(255_255_255/0.5)_inset,0_12px_30px_-10px_rgb(0_0_0/0.7)] transition-all hover:-translate-y-0.5 hover:bg-white/95 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-white/55">
              {mode === "login" ? (
                <>No account?{" "}
                  <button onClick={() => { setMode("signup"); setError(null); setNotice(null); }} className="font-medium text-white hover:underline">Sign up</button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button onClick={() => { setMode("login"); setError(null); setNotice(null); }} className="font-medium text-white hover:underline">Sign in</button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
