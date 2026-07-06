import { SiteShell } from "@/components/site-shell";

export default function Loading() {
  return (
    <SiteShell>
      <div className="mb-5 h-8 w-40 rounded skeleton" />
      <div className="poster-grid">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] rounded-lg skeleton" />
            <div className="mx-auto mt-3 h-4 w-3/4 rounded skeleton" />
          </div>
        ))}
      </div>
    </SiteShell>
  );
}
