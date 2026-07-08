import Link from "next/link";
import { Film, Search, Sparkles } from "lucide-react";
import { DesktopNav, MobileNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 font-black text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),color-mix(in_srgb,var(--accent-secondary)_72%,white))] text-[#06120b] shadow-[0_18px_40px_rgb(0_0_0_/_20%)]">
        <Film size={20} strokeWidth={2.3} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-[21px] leading-none">在线影院</span>
        <span className="mt-1 block text-[11px] font-semibold tracking-[0.28em] text-[var(--text-tertiary)] uppercase">
          online cinema
        </span>
      </span>
    </Link>
  );
}

function SearchForm() {
  return (
    <form action="/search" className="w-full max-w-[720px]">
      <label className="glass-surface flex h-12 items-center gap-3 rounded-full px-4 text-[var(--text-secondary)] transition-colors focus-within:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] focus-within:bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] focus-within:ring-2 focus-within:ring-[color-mix(in_srgb,var(--accent)_18%,transparent)]">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          name="q"
          aria-label="搜索影视"
          placeholder="搜索片名、演员或导演"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-tertiary)]"
        />
      </label>
    </form>
  );
}

function SidebarFooter() {
  return (
    <div className="panel rounded-[var(--radius-lg)] p-4">
      <div className="hero-eyebrow">已接入多线路</div>
      <p className="mt-4 text-sm font-semibold text-[var(--text)]">首页按热播与主分类快速进入，详情页自动聚合可用播放源。</p>
      <p className="mt-2 text-[13px] leading-6 text-[var(--text-secondary)]">
        当某条线路无资源或播放异常时，可以在详情页或播放页直接切换。
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[var(--accent-text)]">
        <Sparkles size={14} aria-hidden="true" />
        内容优先，弱化工具噪音
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-[var(--border)] bg-[linear-gradient(180deg,rgb(255_255_255_/_0.03),transparent_32%),var(--canvas-raised)] lg:block">
        <div className="flex h-20 items-center px-6">
          <Brand />
        </div>
        <DesktopNav />
        <div className="absolute inset-x-4 bottom-5">
          <SidebarFooter />
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--canvas-raised)_82%,transparent)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-4 py-4 lg:hidden">
            <Brand />
            <ThemeToggle />
          </div>
          <div className="mx-auto max-w-[1360px] px-4 lg:hidden">
            <SearchForm />
          </div>
          <div className="mx-auto mt-3 max-w-[1360px] lg:hidden">
            <MobileNav />
          </div>

          <div className="mx-auto hidden h-20 max-w-[1360px] items-center justify-between gap-6 px-8 lg:flex">
            <SearchForm />
            <div className="flex items-center gap-4">
              <div className="hidden text-right xl:block">
                <p className="text-sm font-semibold text-[var(--text)]">沉浸式看片体验</p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">热播、分类、详情和播放统一为深色影院风格</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1360px] px-4 py-7 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
