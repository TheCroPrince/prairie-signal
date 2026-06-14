export function DemoBanner() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 border-b border-line bg-panel px-4 py-1.5 text-center font-mono text-[0.6875rem] tracking-wide text-fg-3">
      <span className="text-watch">Demo environment</span>
      <span aria-hidden>·</span>
      <span>seeded operational data — built to show how real tools could be connected</span>
    </p>
  );
}
