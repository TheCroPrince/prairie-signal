const tones = {
  good: "text-good border-good/30 bg-good/10",
  watch: "text-watch border-watch/30 bg-watch/10",
  risk: "text-risk border-risk/30 bg-risk/10",
  neutral: "text-fg-2 border-line-2 bg-panel-2",
  accent: "text-accent-2 border-accent/30 bg-accent/10",
} as const;

export type BadgeTone = keyof typeof tones;

export function StatusBadge({
  tone,
  children,
  pulse = false,
}: {
  tone: BadgeTone;
  children: React.ReactNode;
  pulse?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider ${tones[tone]}`}
    >
      {pulse && <span className="live-dot size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
