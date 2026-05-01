import { render, screen } from "@testing-library/react";
import Login from "./pages/Login";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn()
}), { virtual: true });

test("renders login form", () => {
  render(<Login />);

  expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /login/i })).toHaveLength(2);
  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
});
