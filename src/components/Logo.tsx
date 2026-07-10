export function Logo({ size = "sm" }: { size?: "sm" | "md" }) {
  const box = size === "md" ? "h-8 w-8" : "h-6 w-6";
  const text = size === "md" ? "text-base" : "text-[15px]";
  return (
    <span className="flex items-center gap-2">
      <span
        className={`${box} flex items-center justify-center rounded-md bg-foreground text-background`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="2.2" />
          <circle cx="18" cy="6" r="2.2" />
          <circle cx="12" cy="18" r="2.2" />
          <path d="M6 8.2 L11.2 15.8" />
          <path d="M18 8.2 L12.8 15.8" />
        </svg>
      </span>
      <span className={`${text} font-semibold tracking-tight font-[family-name:var(--font-display)]`}>
        Make Copilot
      </span>
    </span>
  );
}
