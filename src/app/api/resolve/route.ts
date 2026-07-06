import { resolveMovieByTitle } from "@/lib/mac-cms";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query) return Response.json({ found: false }, { status: 400 });

  try {
    const movie = await resolveMovieByTitle(query);
    return Response.json(movie ? { found: true, href: `/video/${movie.sourceId}/${movie.id}` } : { found: false });
  } catch {
    return Response.json({ found: false }, { status: 503 });
  }
}
