import { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.16_0.02_258)] text-white/90 [color-scheme:dark]">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 45% at 80% 0%, oklch(0.55 0.2 258 / 0.22), transparent 60%), radial-gradient(45% 35% at 10% 30%, oklch(0.5 0.18 258 / 0.12), transparent 65%), linear-gradient(180deg, oklch(0.17 0.02 258) 0%, oklch(0.14 0.018 258) 100%)",
        }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 90% 55% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      {children}
    </div>
  );
}
