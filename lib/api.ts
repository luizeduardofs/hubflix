const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  "Content-Type": "application/json",
};
const baseUrl = "https://api.themoviedb.org/3";

export async function getPopularMovies(page: number = 1) {
  const response = await fetch(
    `${baseUrl}/movie/popular?language=pt-BR&page=${page}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar filmes populares");
  }

  return response.json();
}

export async function getTrendingMovies() {
  const response = await fetch(
    `${baseUrl}/trending/movie/week?language=pt-BR`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar filmes em alta");
  }

  return response.json();
}

export async function getTopRatedMovies(page: number = 1) {
  const response = await fetch(
    `${baseUrl}/movie/top_rated?language=pt-BR&page=${page}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar filmes mais bem avaliados");
  }

  return response.json();
}

export async function searchMovies(query: string) {
  const response = await fetch(
    `${baseUrl}/search/movie?query=${encodeURIComponent(
      query
    )}&include_adult=false&language=pt-BR`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Falha ao buscar filmes");
  }

  return response.json();
}

export async function getMovieDetails(movieId: number) {
  const response = await fetch(`${baseUrl}/movie/${movieId}?language=pt-BR`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar detalhes do filme");
  }

  return response.json();
}
