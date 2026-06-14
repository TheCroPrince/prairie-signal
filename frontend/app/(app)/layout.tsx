import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { ArmatirWordmark, ReturnToArmatir } from "@/components/armatir-brand";
import { BrandMark } from "@/components/brand-mark";
import { BrandSwitcher } from "@/components/brand-switcher";
import { DemoBanner } from "@/components/demo-banner";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { ARMATIR_HOME } from "@/lib/armatir";
import { dashboardPayload } from "@/lib/demo-data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { operator } = dashboardPayload;

  return (
    <div className="atmosphere flex min-h-screen flex-col">
      {/* ── Sticky top chrome: co-brand strip + app bar ── */}
      <div className="app-topbar bg-ink/85 backdrop-blur-md">
        <DemoBanner />

        <header className="border-b border-line">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
            <BrandMark />

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Full brand + theme switcher only has room from sm up; on phones
                  appearance lives on the Customize screen (reachable below). */}
              <div className="hidden sm:flex">
                <BrandSwitcher />
              </div>

              {/* Customize / personalize — the mobile entry point (desktop has it
                  in the sidebar nav). */}
              <Link
                href="/customize"
                aria-label="Customize"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-panel text-fg-2 transition-colors hover:border-line-2 hover:text-fg lg:hidden"
              >
                <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                </svg>
              </Link>

              {/* Operator: bare avatar on phones, full chip from sm up. */}
              <div className="flex items-center gap-2.5 rounded-full sm:border sm:border-line sm:bg-panel sm:py-1 sm:pr-3.5 sm:pl-1">
                <span className="grid size-8 place-items-center rounded-full bg-panel-2 font-display text-xs font-semibold text-accent-2 sm:size-7">
                  MS
                </span>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-xs font-medium text-fg">{operator.name}</span>
                  <span className="block font-mono text-[0.625rem] text-fg-3">{operator.role}</span>
                </span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 pt-4 pb-24 sm:px-6 lg:flex-row lg:gap-8 lg:py-6 lg:pb-6">
        {/* Desktop sidebar — replaced by the bottom tab bar on phones. */}
        <aside className="hidden lg:block lg:w-44 lg:shrink-0">
          <AppNav />
          <div className="mt-3 border-t border-line pt-3">
            <ReturnToArmatir variant="button" className="w-full" />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Desktop footer — phones use the bottom tab bar + the top co-brand strip. */}
      <footer className="hidden border-t border-line lg:block">
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

      <MobileTabBar />
    </div>
  );
}
