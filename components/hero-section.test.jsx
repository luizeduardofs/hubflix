import { render, screen } from "@testing-library/react";
import { HeroSection } from "./hero-section";

const mockMovie = {
  title: "Filme de Teste",
  overview: "Descrição de teste do filme",
  backdrop_path: "/teste-backdrop.jpg",
};

describe("HeroSection", () => {
  it("should render correct section buttons", () => {
    render(<HeroSection movie={mockMovie} />);

    expect(
      screen.getByRole("button", { name: /assistir/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mais informações/i })
    ).toBeInTheDocument();
  });

  it("should render at least watch button", () => {
    render(<HeroSection movie={{ title: "Teste", overview: "Teste" }} />);
    expect(screen.getByText("Assistir")).toBeInTheDocument();
  });
});
