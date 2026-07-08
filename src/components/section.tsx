import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionProps {
  title: string;
  description?: string;
  moreHref?: string;
  children: React.ReactNode;
}

export function Section({ title, description, moreHref, children }: SectionProps) {
  return (
    <section className="mb-14">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[720px]">
          <div className="section-divider" />
          <h2 className="text-[28px] font-black tracking-tight text-[var(--text)] md:text-[32px]">{title}</h2>
          {description ? <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{description}</p> : null}
        </div>
        {moreHref ? (
          <Link
            href={moreHref}
            className="button-secondary shrink-0"
          >
            查看更多
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
