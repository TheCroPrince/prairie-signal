import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { ArmatirWordmark, ReturnToArmatir } from "@/components/armatir-brand";
import { BrandMark } from "@/components/brand-mark";
import { BrandSwitcher } from "@/components/brand-switcher";
import { DemoBanner } from "@/components/demo-banner";
import { ARMATIR_HOME } from "@/lib/armatir";
import { dashboardPayload } from "@/lib/demo-data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { operator } = dashboardPayload;

  return (
    <div className="atmosphere flex min-h-screen flex-col">
      <DemoBanner />

      <header className="border-b border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <BrandMark />

          <div className="flex items-center gap-3">
            <BrandSwitcher />
            <div className="flex items-center gap-2.5 rounded-full border border-line bg-panel py-1 pr-3.5 pl-1">
              <span className="grid size-7 place-items-center rounded-full bg-panel-2 font-display text-xs font-semibold text-accent-2">
                MS
              </span>
              <span className="leading-tight">
                <span className="block text-xs font-medium text-fg">{operator.name}</span>
                <span className="block font-mono text-[0.625rem] text-fg-3">{operator.role}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:gap-8 lg:py-6">
        <aside className="lg:w-44 lg:shrink-0">
          <AppNav />
          <div className="mt-3 border-t border-line pt-3">
            <ReturnToArmatir variant="button" className="w-full" />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <p className="text-xs text-fg-3">
            Want this adapted to your real workflow?{" "}
            <Link href="/customize" className="text-accent-2 underline-offset-4 hover:underline">
              See customization options
            </Link>
          </p>
          <div className="flex items-center gap-4">
            <ArmatirWordmark href={ARMATIR_HOME} label="product demo" markClassName="size-4" />
            <ReturnToArmatir variant="link" />
          </div>
        </div>
      </footer>
    </div>
  );
}
