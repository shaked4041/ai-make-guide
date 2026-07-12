import { FileText, Users, MessageSquare, Filter, Sparkles, CheckCircle2 } from "lucide-react";

/**
 * Premium dark-theme visualization of an example Make.com scenario:
 * Typeform → Filter → HubSpot → Slack
 * Rendered as a modern workflow canvas with an AI prompt bar,
 * animated connectors and floating status chips.
 */
export function WorkflowPreview() {
  const nodes = [
    { icon: FileText, label: "Typeform", sub: "New response", accent: false },
    { icon: Filter, label: "Filter", sub: "Qualified lead", accent: true },
    { icon: Users, label: "HubSpot", sub: "Create contact", accent: false },
    { icon: MessageSquare, label: "Slack", sub: "Notify #sales", accent: false },
  ];

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 70% 30%, oklch(0.62 0.18 258 / 0.35), transparent 60%), radial-gradient(45% 45% at 20% 80%, oklch(0.62 0.18 258 / 0.18), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.19_0.02_258)]/80 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)] backdrop-blur-xl">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Scenario ready
          </div>
          <div className="font-mono text-[11px] text-white/40">v1.0</div>
        </div>

        {/* AI prompt bar */}
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[oklch(0.62_0.18_258)]/20 text-[oklch(0.78_0.16_258)] ring-1 ring-inset ring-[oklch(0.62_0.18_258)]/30">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                Prompt
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/85">
                When a lead submits our Typeform, qualify them and push to HubSpot,
                then notify the sales channel in Slack.
              </p>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative px-6 py-10">
          {/* Grid backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage:
                "radial-gradient(ellipse at center, black 55%, transparent 100%)",
            }}
          />

          <div className="relative grid grid-cols-4 items-start gap-2">
            {nodes.map((n, i) => (
              <div key={n.label} className="flex flex-col items-center">
                <div
                  className={[
                    "relative flex h-16 w-16 items-center justify-center rounded-xl border bg-[oklch(0.22_0.025_258)] shadow-[0_8px_24px_-12px_rgb(0_0_0/0.8)] transition-transform duration-300 hover:-translate-y-0.5",
                    n.accent
                      ? "border-[oklch(0.62_0.18_258)]/50 ring-1 ring-[oklch(0.62_0.18_258)]/30"
                      : "border-white/10",
                  ].join(" ")}
                >
                  <n.icon
                    className={n.accent ? "h-6 w-6 text-[oklch(0.82_0.14_258)]" : "h-6 w-6 text-white/80"}
                    strokeWidth={1.6}
                  />
                  <span className="absolute -top-2 -right-2 rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/70 ring-1 ring-inset ring-white/10">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-3 text-[13px] font-medium leading-tight text-white/90">{n.label}</p>
                <p className="mt-0.5 text-[11px] text-white/45">{n.sub}</p>
              </div>
            ))}
          </div>

          {/* Animated connector line */}
          <svg
            className="pointer-events-none absolute left-6 right-6 top-[calc(2.5rem+32px)] h-px"
            preserveAspectRatio="none"
            viewBox="0 0 100 1"
          >
            <defs>
              <linearGradient id="wf-line" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="oklch(0.62 0.18 258)" stopOpacity="0" />
                <stop offset="50%" stopColor="oklch(0.78 0.16 258)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="oklch(0.62 0.18 258)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line
              x1="12.5"
              y1="0.5"
              x2="87.5"
              y2="0.5"
              stroke="oklch(1 0 0 / 0.12)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1="12.5"
              y1="0.5"
              x2="87.5"
              y2="0.5"
              stroke="url(#wf-line)"
              strokeWidth="1.2"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-40"
                dur="3s"
                repeatCount="indefinite"
              />
            </line>
          </svg>
        </div>

        {/* Footer summary */}
        <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-4 py-2.5 text-[12px]">
          <div className="flex items-center gap-1.5 text-white/55">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            4 modules · 1 filter
          </div>
          <div className="font-mono text-white/45">~3 ops / run</div>
        </div>
      </div>
    </div>
  );
}
