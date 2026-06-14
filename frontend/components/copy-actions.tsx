"use client";

import { useEffect, useRef, useState } from "react";
import { reportAsEmail, reportAsSlack, reportAsText } from "@/lib/format-report";
import type { StructuredReport } from "@/lib/types";

const formats = [
  { id: "email", label: "Copy as email", build: reportAsEmail },
  { id: "slack", label: "Copy as Slack", build: reportAsSlack },
  { id: "text", label: "Copy as text", build: reportAsText },
] as const;

export function CopyActions({ report }: { report: StructuredReport }) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map((format) => (
        <button
          key={format.id}
          type="button"
          onClick={() => copy(format.id, format.build(report))}
          className={`rounded-lg border px-3 py-1.5 font-mono text-[0.6875rem] tracking-wide uppercase transition-colors ${
            copied === format.id
              ? "border-good/40 bg-good/10 text-good"
              : "border-line text-fg-2 hover:border-line-2 hover:text-fg"
          }`}
        >
          {copied === format.id ? "Copied" : format.label}
        </button>
      ))}
    </div>
  );
}
