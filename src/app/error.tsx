"use client";

import { AlertCircle } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--canvas)] p-6">
      <div className="panel-raised w-full max-w-[540px] rounded-[var(--radius-lg)] p-8 text-center">
        <AlertCircle className="mx-auto text-[var(--danger)]" size={46} aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black">内容加载失败</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
          当前外部数据源暂时不可用，或者页面请求超时。你可以直接重新加载，再试一次。
        </p>
        <button type="button" onClick={reset} className="button-primary mt-7">
          重新加载
        </button>
      </div>
    </div>
  );
}
