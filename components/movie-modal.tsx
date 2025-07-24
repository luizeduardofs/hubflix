"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getMovieDetails } from "@/lib/api";
import type { Movie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Play, Plus, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

interface MovieGenres {
  id: number;
  name: string;
}

interface CountryProps {
  iso_3166_1: string;
  name: string;
}

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  const { data: movieDetails } = useQuery({
    queryKey: ["movie", movie?.id],
    queryFn: () => getMovieDetails(movie!.id),
    enabled: !!movie,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/placeholder.svg?height=720&width=1280&text=Sem+Imagem";

  const releaseYear = new Date(movie.release_date).getFullYear();
  const runtime = movieDetails?.runtime;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-gray-900 border-gray-700 overflow-hidden">
        <div className="relative">
          <div className="relative aspect-video">
            <Image
              src={backdropUrl || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {movie.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{releaseYear}</span>
                </div>
                {runtime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{runtime} min</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Assistir
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-gray-600/70 hover:bg-gray-600/90"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Minha Lista
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-gray-600/70 hover:bg-gray-600/90"
                >
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  Gostei
                </Button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {movie.overview}
                </p>

                {movieDetails?.genres && (
                  <div className="mb-4">
                    <h3 className="text-white font-semibold mb-2">Gêneros:</h3>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.genres.map((genre: MovieGenres) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-400">Avaliação: </span>
                  <span className="text-white">
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Data de Lançamento: </span>
                  <span className="text-white">
                    {new Date(movie.release_date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {movieDetails?.production_countries && (
                  <div>
                    <span className="text-gray-400">País: </span>
                    <span className="text-white">
                      {movieDetails.production_countries
                        .map((country: CountryProps) => country.name)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
