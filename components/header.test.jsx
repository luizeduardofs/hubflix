import { fireEvent, render, screen } from "@testing-library/react";
import { Header } from "./header";

jest.mock("./search-modal", () => ({
  SearchModal: jest.fn(({ isOpen, onClose }) => {
    return isOpen ? (
      <div data-testid="mock-search-modal">
        Search Modal Mock
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
  }),
}));

describe("Header", () => {
  it("should render the Header component with main elements", () => {
    render(<Header />);

    expect(screen.getByText("HubFlix")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /início/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /filmes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /séries/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /minha lista/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/buscar filmes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notificações/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/perfil do usuário/i)).toBeInTheDocument();
  });

  it("should change header style on scroll", () => {
    render(<Header />);
    const headerElement = screen.getByRole("banner");

    expect(headerElement).toHaveClass("bg-transparent");
    expect(headerElement).not.toHaveClass("bg-black/90");

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    expect(headerElement).toHaveClass("bg-black/90");
    expect(headerElement).not.toHaveClass("bg-transparent");

    fireEvent.scroll(window, { target: { scrollY: 0 } });

    expect(headerElement).toHaveClass("bg-transparent");
    expect(headerElement).not.toHaveClass("bg-black/90");
  });

  it("should open and close the search modal", async () => {
    render(<Header />);

    expect(screen.queryByTestId("mock-search-modal")).not.toBeInTheDocument();

    const searchButton = screen.getByLabelText(/buscar filmes/i);
    fireEvent.click(searchButton);

    expect(screen.getByTestId("mock-search-modal")).toBeInTheDocument();

    const closeModalButton = screen.getByText("Close Modal");
    fireEvent.click(closeModalButton);

    expect(screen.queryByTestId("mock-search-modal")).not.toBeInTheDocument();
  });
});
