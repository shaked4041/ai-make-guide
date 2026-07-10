import { FileText, Users, MessageSquare, Filter, CheckCircle2 } from "lucide-react";

/**
 * Realistic mock of an example Make.com scenario:
 * Typeform → Filter → HubSpot → Slack
 * Rendered as a professional node diagram (not a cartoon).
 */
export function WorkflowPreview() {
  const nodes = [
    { icon: FileText, label: "Typeform", sub: "New response", tone: "text-foreground" },
    { icon: Filter, label: "Filter", sub: "Qualified lead", tone: "text-muted-foreground" },
    { icon: Users, label: "HubSpot", sub: "Create contact", tone: "text-foreground" },
    { icon: MessageSquare, label: "Slack", sub: "Notify #sales", tone: "text-foreground" },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Scenario ready
        </div>
        <div className="text-[11px] font-mono text-muted-foreground">v1.0</div>
      </div>

      {/* Canvas */}
      <div className="bg-dotted relative px-6 py-10">
        <div className="grid grid-cols-4 items-start gap-2">
          {nodes.map((n, i) => (
            <div key={n.label} className="flex flex-col items-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-background shadow-[var(--shadow-subtle)]">
                <n.icon className={`h-6 w-6 ${n.tone}`} strokeWidth={1.6} />
                <span className="absolute -top-2 -right-2 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-mono font-medium text-background">
                  {i + 1}
                </span>
              </div>
              <p className="mt-3 text-[13px] font-medium leading-tight">{n.label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{n.sub}</p>
            </div>
          ))}
        </div>

        {/* Connector line */}
        <svg
          className="pointer-events-none absolute left-6 right-6 top-[74px] h-px"
          preserveAspectRatio="none"
          viewBox="0 0 100 1"
        >
          <line x1="12.5" y1="0.5" x2="87.5" y2="0.5" stroke="currentColor" className="text-border-strong" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2.5 text-[12px]">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          4 modules · 1 filter
        </div>
        <div className="font-mono text-muted-foreground">~3 ops / run</div>
      </div>
    </div>
  );
}
