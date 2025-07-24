import { render, screen } from "@testing-library/react";
import { MovieCard } from "./movie-card";

const mockMovie = {
  title: "Test Movie",
  poster_path: "/test-poster.jpg",
  vote_average: 7.5,
};

const mockOnClick = jest.fn();

describe("MovieCard", () => {
  it("should render the movie card with basic elements", () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should display the movie title on hover (in accessibility tree)", () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    expect(
      screen.getByLabelText(/Ver detalhes de Test Movie/i)
    ).toBeInTheDocument();
  });
});
