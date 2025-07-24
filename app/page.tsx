import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { MovieSection } from "@/components/movie-section";
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "@/lib/api";

export default async function HomePage() {
  const [popularMovies, trendingMovies, topRatedMovies] = await Promise.all([
    getPopularMovies(1),
    getTrendingMovies(),
    getTopRatedMovies(1),
  ]);

  const heroMovie = popularMovies.results[0];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <HeroSection movie={heroMovie} />

      <div className="relative z-10 -mt-32 space-y-8 pb-20">
        <MovieSection
          title="Populares no HubFlix"
          initialMovies={popularMovies.results}
          type="popular"
        />
        <MovieSection
          title="Em Alta"
          initialMovies={trendingMovies.results}
          type="trending"
        />
        <MovieSection
          title="Mais Bem Avaliados"
          initialMovies={topRatedMovies.results}
          type="top_rated"
        />
      </div>
    </main>
  );
}
