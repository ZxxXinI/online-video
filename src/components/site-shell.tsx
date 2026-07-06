import Link from "next/link";
import {
  Clock3,
  Film,
  Home,
  Search,
  Sparkles,
  Tv,
} from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/category/2", label: "剧集", icon: Tv },
  { href: "/category/4", label: "动漫", icon: Sparkles },
  { href: "/category/1", label: "电影", icon: Film },
  { href: "/category/3", label: "综艺", icon: Tv },
  { href: "/category/46", label: "短剧", icon: Clock3 },
] as const;

function SearchForm({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/search" className={compact ? "w-full" : "w-full max-w-[580px]"}>
      <label className="flex h-11 items-center gap-3 rounded-lg bg-[#e9edf1] px-4 text-[#697386] focus-within:ring-2 focus-within:ring-[#f04444]/30">
        <input
          type="search"
          name="q"
          aria-label="搜索影视"
          placeholder="输入剧名、人名都可以"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#172033] outline-none placeholder:text-[#7e8795]"
        />
        <Search size={19} aria-hidden="true" />
      </label>
    </form>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[200px] border-r border-[#e2e7ec] bg-white lg:block">
        <Link href="/" className="flex h-16 items-center px-8 text-[23px] font-black text-[#ef3340]">
          在线影院
        </Link>
        <nav className="px-4 pt-2" aria-label="主导航">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex h-[51px] items-center gap-3 rounded-md px-4 py-3 text-[16px] font-semibold hover:bg-[#f5f6f8] hover:text-[#ef3340] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f04444]/35"
            >
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-[200px]">
        <div className="sticky top-0 z-20 border-b border-[#e2e7ec] bg-white/95 backdrop-blur lg:hidden">
          <nav className="flex h-12 items-center gap-5 overflow-x-auto px-4 text-sm font-semibold" aria-label="移动端导航">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="shrink-0 py-3 hover:text-[#ef3340]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <header className="border-b border-[#e2e7ec] bg-white">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 py-6 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-0">
            <Link href="/" className="text-center text-[27px] font-black text-[#ef3340] lg:hidden">
              在线影院
            </Link>
            <SearchForm compact />
            <div className="hidden shrink-0 items-center gap-2 text-sm text-[#697386] lg:flex">
              <Clock3 size={17} aria-hidden="true" />
              轻松找片，专注观影
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1240px] px-4 py-8 lg:px-6 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
