import type { StructuredReport } from "./types";

function bullets(items: string[], marker = "-"): string {
  return items.map((item) => `${marker} ${item}`).join("\n");
}

export function reportAsEmail(report: StructuredReport): string {
  return [
    `Subject: ${report.title} — ${report.generatedAtLabel}`,
    "",
    report.summary,
    "",
    "Key changes:",
    bullets(report.changes),
    "",
    "Risks:",
    bullets(report.risks),
    "",
    "Recommended actions:",
    bullets(report.recommendedActions),
    "",
    `Source records: ${report.sourceRecords.join(", ")}`,
  ].join("\n");
}

export function reportAsSlack(report: StructuredReport): string {
  return [
    `*${report.title}* (${report.generatedAtLabel})`,
    report.summary,
    "",
    `*Risks*`,
    bullets(report.risks, "•"),
    "",
    `*Next actions*`,
    bullets(report.recommendedActions, "•"),
  ].join("\n");
}

export function reportAsText(report: StructuredReport): string {
  return [
    `${report.title} — ${report.generatedAtLabel}`,
    "",
    report.summary,
    "",
    "Changes:",
    bullets(report.changes),
    "",
    "Risks:",
    bullets(report.risks),
    "",
    "Actions:",
    bullets(report.recommendedActions),
  ].join("\n");
}
