"use client";

import { Button } from "@/components/ui/button";
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "@/lib/api";
import type { Movie } from "@/types/movie";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MovieCard } from "./movie-card";
import { MovieModal } from "./movie-modal";

interface MovieSectionProps {
  title: string;
  initialMovies: Movie[];
  type: "popular" | "trending" | "top_rated";
}

export function MovieSection({
  title,
  initialMovies,
  type,
}: MovieSectionProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["movies", type],
      queryFn: ({ pageParam = 1 }) => {
        switch (type) {
          case "popular":
            return getPopularMovies(pageParam);
          case "trending":
            return getTrendingMovies();
          case "top_rated":
            return getTopRatedMovies(pageParam);
          default:
            return getPopularMovies(pageParam);
        }
      },
      getNextPageParam: (lastPage) => {
        return lastPage.page < lastPage.total_pages
          ? lastPage.page + 1
          : undefined;
      },
      initialData: {
        pages: [
          {
            results: initialMovies,
            page: 1,
            total_pages: 500,
            total_results: 10000,
          },
        ],
        pageParams: [1],
      },
      initialPageParam: 1,
    });

  const allMovies = data?.pages.flatMap((page) => page.results) || [];

  return (
    <section className="px-4 md:px-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {allMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => setSelectedMovie(movie)}
          />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            {isFetchingNextPage ? "Carregando..." : "Carregar Mais"}
          </Button>
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  );
}
