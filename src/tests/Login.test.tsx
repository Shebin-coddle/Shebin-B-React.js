import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Login from "../pages/Login";
import { LoginUser } from "../services/AuthService";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../services/AuthService", () => ({
  LoginUser: vi.fn(),
}));

const mockedLoginUser = vi.mocked(LoginUser);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

test("shows email required error", () => {
  render(<Login />);

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(screen.getByText("Email is required")).toBeInTheDocument();
});

test("shows password required error", () => {
  render(<Login />);

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@gmail.com" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(screen.getByText("Password is required")).toBeInTheDocument();
});

test("shows invalid email error", () => {
  render(<Login />);

  fireEvent.change(screen.getByLabelText("Email"), {
  target: { value: "wrong@gmail" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
});

test("shows short password error", () => {
  render(<Login />);

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(
    screen.getByText("Password must be at least 6 characters"),
  ).toBeInTheDocument();
});

test("logs in admin successfully", async () => {
 mockedLoginUser.mockResolvedValue({
  success: true,
  message: "Login successful",
  token: "test-token",
  user: {
    id: 1,
    email: "admin@gmail.com",
    role_id: 1,
  },
});
  render(<Login />);

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "admin@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(await screen.findByText("Logging in...")).toBeInTheDocument();

  expect(mockNavigate).toHaveBeenCalledWith("/admin-dashboard");
  expect(localStorage.getItem("token")).toBe("test-token");
  expect(localStorage.getItem("role_id")).toBe("1");
  expect(localStorage.getItem("user_id")).toBe("1");
});

test("shows invalid login response error", async () => {
 mockedLoginUser.mockResolvedValue({
  success: false,
  message: "Invalid login response",
});

  render(<Login />);

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(await screen.findByText("Invalid login response")).toBeInTheDocument();
});

test("shows API error message", async () => {
  mockedLoginUser.mockRejectedValue(new Error("Invalid email or password"));

  render(<Login />);

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(
    await screen.findByText("Invalid email or password"),
  ).toBeInTheDocument();
});