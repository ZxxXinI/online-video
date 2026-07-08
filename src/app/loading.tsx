import { SiteShell } from "@/components/site-shell";

export default function Loading() {
  return (
    <SiteShell>
      <div className="hero-panel mb-12 min-h-[320px] p-6 md:p-8">
        <div className="h-8 w-32 rounded-full skeleton" />
        <div className="mt-6 h-14 w-full max-w-[640px] rounded-[var(--radius-md)] skeleton" />
        <div className="mt-4 h-5 w-full max-w-[520px] rounded-[var(--radius-sm)] skeleton" />
        <div className="mt-3 h-5 w-full max-w-[440px] rounded-[var(--radius-sm)] skeleton" />
      </div>

      <div className="mb-6 h-10 w-56 rounded-[var(--radius-md)] skeleton" />
      <div className="poster-grid">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] rounded-[calc(var(--radius-lg)-2px)] skeleton" />
            <div className="mt-3 h-5 w-5/6 rounded-[var(--radius-sm)] skeleton" />
            <div className="mt-2 h-4 w-2/3 rounded-[var(--radius-sm)] skeleton" />
          </div>
        ))}
      </div>
    </SiteShell>
  );
}
