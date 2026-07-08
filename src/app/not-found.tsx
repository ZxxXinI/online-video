import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--canvas)] p-6 text-center">
      <div className="panel-raised w-full max-w-[560px] rounded-[var(--radius-lg)] p-8">
        <div className="text-7xl font-black text-[var(--accent)]">404</div>
        <h1 className="mt-4 text-3xl font-black">没有找到这个页面</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          内容可能已经下线，或者当前地址输入有误。可以先返回首页继续浏览热播和分类内容。
        </p>
        <Link href="/" className="button-primary mt-7">
          返回首页
        </Link>
      </div>
    </div>
  );
}
