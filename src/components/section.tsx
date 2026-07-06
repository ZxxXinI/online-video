import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Section({ title, moreHref, children }: { title: string; moreHref?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[23px] font-black text-[#172033]">{title}</h2>
        {moreHref && (
          <Link href={moreHref} className="flex items-center text-sm text-[#697386] hover:text-[#ef3340]">
            更多 <ChevronRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
