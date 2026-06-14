"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Bottom tab bar — the primary navigation on phones (the desktop sidebar is
// hidden < lg). Five operational destinations; "Customize" lives in the top bar
// as the demo's personalize/settings surface.
const tabs = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/reports", label: "Reports", icon: ReportsIcon },
  { href: "/automations", label: "Automations", icon: AutomationsIcon },
  { href: "/assistant", label: "Assistant", icon: AssistantIcon },
  { href: "/data-sources", label: "Sources", icon: SourcesIcon },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="app-bottom-nav border-t border-line bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-1">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[3.25rem] flex-col items-center justify-center gap-1 text-[0.625rem] font-medium tracking-tight transition-colors ${
                  active ? "text-accent-2" : "text-fg-3 active:text-fg-2"
                }`}
              >
                <Icon active={active} />
                <span className="leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
// Simple line icons; the active tab gets a soft accent-tinted pill behind it.

function IconShell({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`grid size-7 place-items-center rounded-lg transition-colors ${
        active ? "bg-accent/12" : ""
      }`}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[1.15rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </IconShell>
  );
}

function ReportsIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M8.5 13h7M8.5 16.5h5" />
    </IconShell>
  );
}

function AutomationsIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z" />
    </IconShell>
  );
}

function AssistantIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
      <path d="M9 10h6M9 13.5h4" />
    </IconShell>
  );
}

function SourcesIcon({ active }: { active: boolean }) {
  return (
    <IconShell active={active}>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      <path d="M4 11.5v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </IconShell>
  );
}
