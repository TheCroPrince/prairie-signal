"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reports", label: "Reports" },
  { href: "/automations", label: "Automations" },
  { href: "/assistant", label: "Assistant" },
  { href: "/data-sources", label: "Data Sources" },
  { href: "/customize", label: "Customize" },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard sections" className="min-w-0">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-accent/10 font-medium text-accent-2"
                    : "text-fg-2 hover:bg-panel-2 hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
