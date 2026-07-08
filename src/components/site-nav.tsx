"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Clock3, Film, Home, Sparkles, Tv } from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/category/2", label: "剧集", icon: Tv },
  { href: "/category/4", label: "动漫", icon: Sparkles },
  { href: "/category/1", label: "电影", icon: Film },
  { href: "/category/3", label: "综艺", icon: Tv },
  { href: "/category/46", label: "短剧", icon: Clock3 },
] as const;

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-3" aria-label="主导航">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group flex h-12 items-center gap-3 rounded-[var(--radius-md)] px-4 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              active
                ? "bg-[var(--accent-soft)] text-[var(--text)]"
                : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text)]"
            }`}
          >
            <span
              className={`flex size-8 items-center justify-center rounded-full border ${
                active
                  ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent)]"
                  : "border-transparent bg-white/[0.03] text-[var(--text-tertiary)] group-hover:text-[var(--text)]"
              }`}
            >
              <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
            </span>
            {label}
            <ChevronRight
              size={16}
              className={`ml-auto transition-transform ${
                active ? "text-[var(--accent)]" : "text-transparent group-hover:text-[var(--text-tertiary)]"
              } group-hover:translate-x-0.5`}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="scroll-row flex gap-2 overflow-x-auto px-2 pb-3" aria-label="移动端导航">
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--accent-soft)] text-[var(--text)]"
                : "border-transparent bg-white/[0.03] text-[var(--text-secondary)] hover:text-[var(--text)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
