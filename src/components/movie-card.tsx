import Link from "next/link";
import { PosterImage } from "@/components/poster-image";
import type { MovieSummary } from "@/lib/types";

export function MovieCard({ movie }: { movie: MovieSummary }) {
  return (
    <Link href={`/video/${movie.sourceId}/${movie.id}`} className="poster-card" title={movie.name}>
      <div className="poster-frame">
        <PosterImage src={movie.cover} alt={movie.name} />
        {movie.remarks && <span className="poster-remark">{movie.remarks}</span>}
      </div>
      <div className="poster-title">{movie.name}</div>
    </Link>
  );
}

export function MovieGrid({ movies }: { movies: MovieSummary[] }) {
  if (movies.length === 0) {
    return <EmptyState message="暂时没有找到相关内容" />;
  }
  return <div className="poster-grid">{movies.map((movie) => <MovieCard key={`${movie.sourceId}-${movie.id}`} movie={movie} />)}</div>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-[#ccd3da] bg-white text-sm text-[#697386]">
      {message}
    </div>
  );
}
