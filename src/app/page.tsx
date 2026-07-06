import { HotGrid } from "@/components/hot-grid";
import { MovieGrid } from "@/components/movie-card";
import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { getHotRecommendations } from "@/lib/hot";
import { listCategoryMovies } from "@/lib/mac-cms";

export const revalidate = 300;

export default async function HomePage() {
  const [hot, series, movies, anime, variety] = await Promise.all([
    getHotRecommendations(),
    safeList(2),
    safeList(1),
    safeList(4),
    safeList(3),
  ]);

  return (
    <SiteShell>
      <Section title="在线影院热播">
        <HotGrid items={hot} />
      </Section>
      <Section title="剧集" moreHref="/category/2"><MovieGrid movies={series} /></Section>
      <Section title="电影" moreHref="/category/1"><MovieGrid movies={movies} /></Section>
      <Section title="动漫" moreHref="/category/4"><MovieGrid movies={anime} /></Section>
      <Section title="综艺" moreHref="/category/3"><MovieGrid movies={variety} /></Section>
    </SiteShell>
  );
}

async function safeList(typeId: number) {
  try {
    return (await listCategoryMovies(typeId)).items.slice(0, 12);
  } catch {
    return [];
  }
}
