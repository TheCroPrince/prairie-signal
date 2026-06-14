"use client";

import { brands } from "@/lib/brands";
import { useBrand } from "./brand-provider";

export function BrandSwitcher() {
  const { brand, mode, setBrand, setMode } = useBrand();

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-full border border-line bg-panel p-1"
        role="group"
        aria-label="Brand preset"
      >
        {brands.map((option) => {
          const active = option.id === brand.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setBrand(option.id)}
              aria-pressed={active}
              aria-label={option.short}
              title={`${option.short} — ${option.tagline}`}
              className={`size-5 rounded-full border transition-transform sm:size-6 ${
                active ? "scale-110 border-fg/50" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: option.swatch }}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="grid size-8 place-items-center rounded-full border border-line bg-panel text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
      >
        {mode === "dark" ? (
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
