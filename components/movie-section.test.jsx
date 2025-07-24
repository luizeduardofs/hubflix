import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MovieSection } from "./movie-section";

jest.mock("@/lib/api", () => ({
  getPopularMovies: jest.fn(),
  getTrendingMovies: jest.fn(),
  getTopRatedMovies: jest.fn(),
}));

jest.mock("./movie-card", () => ({
  MovieCard: jest.fn(({ movie, onClick }) => (
    <div data-testid="movie-card" onClick={() => onClick(movie)}>
      {movie.title}
    </div>
  )),
}));

jest.mock("./movie-modal", () => ({
  MovieModal: jest.fn(() => <div data-testid="movie-modal" />),
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useInfiniteQuery: jest.fn(),
}));

const mockInitialMovies = [
  { id: 1, title: "Movie 1", poster_path: "/movie1.jpg" },
  { id: 2, title: "Movie 2", poster_path: "/movie2.jpg" },
];

const mockQueryData = {
  pages: [
    {
      results: mockInitialMovies,
      page: 1,
      total_pages: 10,
      total_results: 100,
    },
  ],
  pageParams: [1],
};

describe("MovieSection", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    useInfiniteQuery.mockReturnValue({
      data: mockQueryData,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    });
  });

  it("should render the section with title and initial movies", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MovieSection
          title="Popular Movies"
          initialMovies={mockInitialMovies}
          type="popular"
        />
      </QueryClientProvider>
    );

    expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    expect(screen.getAllByTestId("movie-card")).toHaveLength(2);
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
  });

  it("should show load more button when hasNextPage is true", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MovieSection
          title="Popular Movies"
          initialMovies={mockInitialMovies}
          type="popular"
        />
      </QueryClientProvider>
    );

    expect(
      screen.getByRole("button", { name: /carregar mais/i })
    ).toBeInTheDocument();
  });

  it("should call fetchNextPage when load more button is clicked", () => {
    const mockFetchNextPage = jest.fn();
    useInfiniteQuery.mockReturnValue({
      data: mockQueryData,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MovieSection
          title="Popular Movies"
          initialMovies={mockInitialMovies}
          type="popular"
        />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /carregar mais/i }));
    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it("should show loading state when fetching more movies", () => {
    useInfiniteQuery.mockReturnValue({
      data: mockQueryData,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MovieSection
          title="Popular Movies"
          initialMovies={mockInitialMovies}
          type="popular"
        />
      </QueryClientProvider>
    );

    expect(
      screen.getByRole("button", { name: /carregando/i })
    ).toBeInTheDocument();
  });

  it("should open modal when a movie card is clicked", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MovieSection
          title="Popular Movies"
          initialMovies={mockInitialMovies}
          type="popular"
        />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("Movie 1"));
    expect(screen.getByTestId("movie-modal")).toBeInTheDocument();
  });

  it("should call correct API based on type", () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MovieSection
          title="Popular Movies"
          initialMovies={mockInitialMovies}
          type="popular"
        />
      </QueryClientProvider>
    );

    expect(useInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["movies", "popular"],
      })
    );

    rerender(
      <QueryClientProvider client={queryClient}>
        <MovieSection
          title="Top Rated Movies"
          initialMovies={mockInitialMovies}
          type="top_rated"
        />
      </QueryClientProvider>
    );

    expect(useInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["movies", "top_rated"],
      })
    );
  });
});
