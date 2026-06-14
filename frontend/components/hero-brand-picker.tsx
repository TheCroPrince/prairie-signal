"use client";

import { brands } from "@/lib/brands";
import { useBrand } from "./brand-provider";

// The landing hero's live "see it in your brand" control — re-skins the whole
// page as visitors try each identity, and the choice carries into the demo.
export function HeroBrandPicker() {
  const { brand, mode, setBrand, setMode } = useBrand();

  return (
    <div className="rounded-xl border border-line bg-panel/60 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="eyebrow">See it in your brand</p>
        <button
          type="button"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          className="font-mono text-[0.6875rem] tracking-wide text-fg-3 transition-colors hover:text-fg"
        >
          {mode === "dark" ? "Try light mode" : "Try dark mode"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {brands.map((option) => {
          const active = option.id === brand.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setBrand(option.id)}
              aria-pressed={active}
              title={`${option.short} — ${option.tagline}`}
              className={`flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-xs transition-colors ${
                active
                  ? "border-accent/50 bg-accent/10 text-fg"
                  : "border-line text-fg-2 hover:border-line-2 hover:text-fg"
              }`}
            >
              <span className="size-4 rounded-full" style={{ backgroundColor: option.swatch }} aria-hidden />
              {option.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
