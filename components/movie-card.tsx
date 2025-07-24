import type { Movie } from "@/types/movie";
import { Star } from "lucide-react";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg?height=750&width=500&text=Sem+Poster";

  return (
    <div
      className="group cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Ver detalhes de ${movie.title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
        <Image
          src={posterUrl || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-80"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">
            {movie.title}
          </h3>
          <div className="flex items-center text-xs text-gray-300">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
