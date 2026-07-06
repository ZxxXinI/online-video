"use client";

import { AlertCircle } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] p-6">
      <div className="max-w-md text-center">
        <AlertCircle className="mx-auto text-[#ef3340]" size={44} aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold">内容加载失败</h1>
        <p className="mt-2 text-sm text-[#697386]">数据源暂时不可用，请稍后重试。</p>
        <button type="button" onClick={reset} className="mt-6 rounded-md bg-[#f04444] px-5 py-2.5 text-sm font-semibold text-white">重新加载</button>
      </div>
    </div>
  );
}
