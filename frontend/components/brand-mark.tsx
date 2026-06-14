"use client";

import Link from "next/link";
import { useBrand } from "./brand-provider";

export function BrandMark() {
  const { brand } = useBrand();

  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid size-8 place-items-center rounded-lg border border-accent/30 bg-accent/10 font-display text-sm font-bold text-accent-2">
        {brand.monogram}
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold text-fg">{brand.name}</span>
        <span className="block font-mono text-[0.6875rem] text-fg-3">AI Workflow Dashboard</span>
      </span>
    </Link>
  );
}
