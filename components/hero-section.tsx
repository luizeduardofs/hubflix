import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";
import { Info, Play } from "lucide-react";

interface HeroSectionProps {
  movie: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/placeholder.svg?height=720&width=1280&text=HubFlix";

  return (
    <section className="relative h-screen flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backdropUrl})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 hero-gradient" />

      <div className="relative z-10 px-4 md:px-8 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {movie.title}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200 line-clamp-3">
          {movie.overview}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 font-semibold"
          >
            <Play className="mr-2 h-5 w-5 fill-current" />
            Assistir
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-gray-600/70 text-white hover:bg-gray-600/90 font-semibold"
          >
            <Info className="mr-2 h-5 w-5" />
            Mais Informações
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 gradient-overlay" />
    </section>
  );
}
