import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] p-6 text-center">
      <div>
        <div className="text-7xl font-black text-[#ef3340]">404</div>
        <h1 className="mt-3 text-2xl font-bold">没有找到这个页面</h1>
        <p className="mt-2 text-sm text-[#697386]">内容可能已下线，或者地址输入有误。</p>
        <Link href="/" className="mt-6 inline-block rounded-md bg-[#f04444] px-5 py-2.5 text-sm font-semibold text-white">返回首页</Link>
      </div>
    </div>
  );
}
