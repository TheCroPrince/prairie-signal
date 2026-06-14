import { ArmatirWordmark, ReturnToArmatir } from "@/components/armatir-brand";
import { ARMATIR_HOME } from "@/lib/armatir";

export function DemoBanner() {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line bg-panel px-4 py-1.5 sm:px-6">
      <ArmatirWordmark href={ARMATIR_HOME} label="product demo" markClassName="size-4" />

      <p className="hidden flex-1 justify-center gap-x-2 text-center font-mono text-[0.6875rem] tracking-wide text-fg-3 sm:flex">
        <span className="text-watch">Demo environment</span>
        <span aria-hidden>·</span>
        <span>seeded operational data</span>
      </p>

      <ReturnToArmatir variant="link" />
    </div>
  );
}
