"use client";

import { useEffect, useRef, useState } from "react";
import type { AssistantResponse } from "@/lib/types";

const suggestedPrompts = [
  "What should Maya handle first today?",
  "Which customers are at risk?",
  "What changed since yesterday?",
  "Draft an owner update.",
  "Which invoices need attention?",
];

type Message =
  | { role: "user"; id: string; text: string }
  | { role: "assistant"; id: string; text: string; sources: string[] }
  | { role: "error"; id: string; text: string };

export function OperationsAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, pending]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || pending) return;
    setInput("");
    setPending(true);
    setMessages((current) => [...current, { role: "user", id: `u-${Date.now()}`, text: trimmed }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "The assistant is unavailable.");
      const answer = payload as AssistantResponse;
      setMessages((current) => [
        ...current,
        { role: "assistant", id: `a-${Date.now()}`, text: answer.answer, sources: answer.sourceRecords },
      ]);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: "error",
          id: `e-${Date.now()}`,
          text: err instanceof Error ? err.message : "The assistant is unavailable.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  async function copyAnswer(message: Message) {
    if (message.role !== "assistant") return;
    await navigator.clipboard.writeText(message.text);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 1600);
  }

  return (
    <div className="panel flex min-h-[26rem] flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
            <p className="font-display text-lg font-medium text-fg">
              Ask about today&apos;s operations
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-fg-2">
              Answers come strictly from the seeded dashboard data, with source records attached —
              try one of the prompts below.
            </p>
          </div>
        )}

        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-sm border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm leading-relaxed text-fg">
                  {message.text}
                </p>
              </div>
            );
          }
          if (message.role === "error") {
            return (
              <div key={message.id} className="flex">
                <p className="max-w-[85%] rounded-2xl rounded-bl-sm border border-risk/30 bg-risk/10 px-4 py-2.5 text-sm leading-relaxed text-risk">
                  {message.text}
                </p>
              </div>
            );
          }
          return (
            <div key={message.id} className="flex">
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-line bg-panel-2/60 px-4 py-3">
                <p className="text-sm leading-relaxed text-fg-2">{message.text}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-line pt-2.5">
                  {message.sources.map((record) => (
                    <span
                      key={record}
                      className="rounded border border-line bg-panel px-2 py-0.5 font-mono text-[0.625rem] text-accent-2/80"
                    >
                      {record}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => copyAnswer(message)}
                    className={`ml-auto font-mono text-[0.625rem] tracking-wider uppercase transition-colors ${
                      copiedId === message.id ? "text-good" : "text-fg-3 hover:text-fg"
                    }`}
                  >
                    {copiedId === message.id ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {pending && (
          <div className="flex">
            <p className="rounded-2xl rounded-bl-sm border border-line bg-panel-2/60 px-4 py-2.5 font-mono text-xs text-fg-3">
              Checking the records…
            </p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-4">
        <div className="flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => ask(prompt)}
              disabled={pending}
              className="rounded-full border border-line px-3 py-1 text-xs text-fg-2 transition-colors hover:border-line-2 hover:text-fg disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            ask(input);
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about orders, invoices, leads, or dispatch…"
            aria-label="Ask the operations assistant"
            className="min-w-0 flex-1 rounded-lg border border-line bg-panel-2/60 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3 focus:border-accent/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending || input.trim() === ""}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
