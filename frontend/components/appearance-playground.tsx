"use client";

import { brands } from "@/lib/brands";
import { useBrand } from "./brand-provider";
import { MiniDashboard } from "./mini-dashboard";

// Customize-page appearance controls. Same global theme store as the header,
// so changing the accent or mode here re-skins the entire demo live, with the
// mini dashboard beside it as an immediate sample.
export function AppearancePlayground() {
  const { brand, mode, setBrand, setMode } = useBrand();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
      <div className="panel p-5">
        <p className="eyebrow mb-3">Brand & accent</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Brand">
          {brands.map((option) => {
            const active = option.id === brand.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setBrand(option.id)}
                aria-pressed={active}
                title={option.tagline}
                className={`flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/10 text-fg"
                    : "border-line text-fg-2 hover:border-line-2 hover:text-fg"
                }`}
              >
                <span
                  className="size-4 rounded-full"
                  style={{ backgroundColor: option.swatch }}
                  aria-hidden
                />
                {option.short}
              </button>
            );
          })}
        </div>

        <p className="eyebrow mt-5 mb-3">Appearance mode</p>
        <div className="flex gap-2" role="group" aria-label="Appearance mode">
          {(["dark", "light"] as const).map((option) => {
            const active = mode === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                aria-pressed={active}
                className={`rounded-lg border px-4 py-1.5 text-sm capitalize transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/10 text-accent-2"
                    : "border-line text-fg-2 hover:border-line-2 hover:text-fg"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-fg-2">
          Every surface, chart, and report inherits the brand color and mode — change them here and
          the whole dashboard re-skins instantly. A real build ships in your colors, logo, and
          domain.
        </p>
      </div>

      <div>
        <MiniDashboard />
      </div>
    </div>
  );
}
