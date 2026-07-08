import Link from "next/link";
import { PosterImage } from "@/components/poster-image";
import type { MovieSummary } from "@/lib/types";

export function MovieCard({ movie }: { movie: MovieSummary }) {
  return (
    <Link href={`/video/${movie.sourceId}/${movie.id}`} className="poster-card" title={movie.name}>
      <div className="poster-frame">
        <PosterImage src={movie.cover} alt={movie.name} />
        {movie.score && Number(movie.score) > 0 ? <span className="poster-score">{movie.score}</span> : null}
        {movie.remarks ? <span className="poster-remark">{movie.remarks}</span> : null}
      </div>
      <div className="poster-copy">
        <div className="poster-title">{movie.name}</div>
        <div className="poster-meta-row">
          <span>{movie.typeName || "影视"}</span>
          {movie.year ? <span>{movie.year}</span> : null}
          {!movie.year && movie.area ? <span>{movie.area}</span> : null}
        </div>
      </div>
    </Link>
  );
}

export function MovieGrid({ movies }: { movies: MovieSummary[] }) {
  if (movies.length === 0) {
    return <EmptyState message="暂时没有找到相关内容" />;
  }

  return (
    <div className="poster-grid">
      {movies.map((movie) => (
        <MovieCard key={`${movie.sourceId}-${movie.id}`} movie={movie} />
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="empty-panel text-sm">{message}</div>;
}
