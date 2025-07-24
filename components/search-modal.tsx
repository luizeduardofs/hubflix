"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { searchMovies } from "@/lib/api";
import type { Movie, SearchMovie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MovieCard } from "./movie-card";
import { MovieModal } from "./movie-modal";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: () => searchMovies(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2,
  });

  const handleClose = useCallback(() => {
    setSearchTerm("");
    setSelectedMovie(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedMovie) {
          setSelectedMovie(null);
        } else {
          handleClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, selectedMovie, handleClose]);

  console.log(searchResults);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0 bg-gray-900 border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Buscar Filmes</h2>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Digite o nome do filme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto max-h-96">
              {isLoading && debouncedSearchTerm && (
                <div className="text-center py-8 text-gray-400">
                  Buscando filmes...
                </div>
              )}

              {searchResults && searchResults.results.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.results.map((movie: SearchMovie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => setSelectedMovie(movie)}
                    />
                  ))}
                </div>
              )}

              {searchResults &&
                searchResults.results.length === 0 &&
                debouncedSearchTerm && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhum filme encontrado para "{debouncedSearchTerm}"
                  </div>
                )}

              {!debouncedSearchTerm && (
                <div className="text-center py-8 text-gray-400">
                  Digite pelo menos 3 caracteres para buscar filmes
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </>
  );
}
