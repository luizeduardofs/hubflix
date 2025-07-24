import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MovieModal } from "./movie-modal";

jest.mock("@/lib/api", () => ({
  getMovieDetails: jest.fn().mockResolvedValue({
    runtime: 120,
    genres: [{ id: 1, name: "Action" }],
    production_countries: [{ iso_3166_1: "US", name: "United States" }],
  }),
}));

const mockMovie = {
  id: 123,
  title: "Test Movie",
  backdrop_path: "/test-backdrop.jpg",
  vote_average: 7.5,
  release_date: "2023-01-01",
  overview: "Test movie overview",
};

describe("MovieModal", () => {
  const queryClient = new QueryClient();

  it("should not render when closed", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MovieModal movie={mockMovie} isOpen={false} onClose={jest.fn()} />
      </QueryClientProvider>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should display basic movie information when open", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MovieModal movie={mockMovie} isOpen={true} onClose={jest.fn()} />
      </QueryClientProvider>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
    expect(await screen.findByText(mockMovie.overview)).toBeInTheDocument();
    expect(screen.getByText("7.5")).toBeInTheDocument();
  });

  it("should render action buttons", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MovieModal movie={mockMovie} isOpen={true} onClose={jest.fn()} />
      </QueryClientProvider>
    );

    expect(
      screen.getByRole("button", { name: /assistir/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /minha lista/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /gostei/i })).toBeInTheDocument();
  });
});
