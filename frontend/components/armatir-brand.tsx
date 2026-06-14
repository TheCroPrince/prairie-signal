import { ARMATIR_DEMOS, ARMATIR_HOME } from "@/lib/armatir";

// ── Armatir logo mark ────────────────────────────────────────────────────────
// The two-blade "A" — dark navy left arm, blue gradient right arm. Colors are
// fixed (not the tenant `--color-accent`) so the Armatir identity stays
// consistent even when the brand switcher recolors the rest of the demo.
export function ArmatirMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="armatir-mark-left" x1="13" y1="3" x2="7" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e2d47" />
          <stop offset="100%" stopColor="#0a1120" />
        </linearGradient>
        <linearGradient id="armatir-mark-right" x1="20" y1="3" x2="33" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7ec8fd" />
          <stop offset="100%" stopColor="#1855f0" />
        </linearGradient>
      </defs>
      <path d="M3 37 L16 3 L23 3 L11 37 Z" fill="url(#armatir-mark-left)" />
      <path d="M17 3 L24 3 L37 37 L28 37 Z" fill="url(#armatir-mark-right)" />
    </svg>
  );
}

// ── Armatir wordmark lockup ──────────────────────────────────────────────────
// Mark + "Armatir", with an optional muted suffix label (e.g. "product demo").
// When `href` is set it links out to armatir.com.
export function ArmatirWordmark({
  href,
  label,
  markClassName = "size-5",
  className = "",
}: {
  href?: string;
  label?: string;
  markClassName?: string;
  className?: string;
}) {
  const lockup = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <ArmatirMark className={markClassName} />
      <span className="inline-flex items-baseline gap-1.5 leading-none">
        <span className="font-display text-sm font-semibold tracking-tight text-fg">Armatir</span>
        {label ? <span className="font-mono text-[0.625rem] text-fg-3">· {label}</span> : null}
      </span>
    </span>
  );

  if (!href) return lockup;

  return (
    <a href={href} className="inline-flex transition-opacity hover:opacity-80">
      {lockup}
    </a>
  );
}

// ── Return-to-Armatir CTA ────────────────────────────────────────────────────
// Sends the visitor back to the Armatir demo hub. Brand-neutral surface styling
// (so it doesn't fight the tenant accent); the Armatir mark carries the brand.
function ChevronLeft({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M10 12 L6 8 L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReturnToArmatir({
  variant = "button",
  className = "",
}: {
  variant?: "button" | "link";
  className?: string;
}) {
  if (variant === "link") {
    return (
      <a
        href={ARMATIR_DEMOS}
        className={`group inline-flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-wide text-fg-3 transition-colors hover:text-fg ${className}`}
      >
        <ChevronLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
        Return to Armatir
      </a>
    );
  }

  return (
    <a
      href={ARMATIR_DEMOS}
      className={`group inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-panel px-3.5 py-2 text-sm text-fg-2 transition-colors hover:border-line-2 hover:text-fg ${className}`}
    >
      <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
      <ArmatirMark className="size-4" />
      <span className="font-medium">Return to Armatir</span>
    </a>
  );
}

export { ARMATIR_DEMOS, ARMATIR_HOME };
