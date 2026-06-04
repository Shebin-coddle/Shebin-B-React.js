import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/login";
import { loginUser } from "../services/authService";
import { vi } from "vitest";

vi.mock("../services/authService", () => ({
  loginUser: vi.fn(),
}));

const mockedLoginUser = vi.mocked(loginUser);

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear();
  mockedLoginUser.mockReset();
});

test("renders login form", () => {
  renderLogin();

  expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

  expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();

  expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();

  expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
});

test("allows user to type email and password", async () => {
  renderLogin();

  const emailInput = screen.getByPlaceholderText("Enter email");
  const passwordInput = screen.getByPlaceholderText("Enter password");

  await userEvent.type(emailInput, "admin@gmail.com");
  await userEvent.type(passwordInput, "123456");

  expect(emailInput).toHaveValue("admin@gmail.com");
  expect(passwordInput).toHaveValue("123456");
});

test("shows error message when login fails", async () => {
  mockedLoginUser.mockRejectedValueOnce(new Error("Invalid email or password"));

  renderLogin();

  await userEvent.type(
    screen.getByPlaceholderText("Enter email"),
    "wrong@gmail.com",
  );

  await userEvent.type(
    screen.getByPlaceholderText("Enter password"),
    "wrongpass",
  );

  await userEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(
    await screen.findByText("Invalid email or password"),
  ).toBeInTheDocument();
});

test("redirects admin user after successful login", async () => {
  mockedLoginUser.mockResolvedValueOnce({
    success: true,
    message: "Login successful",
    token: "admin-token",
    user: {
      id: 1,
      email: "admin@gmail.com",
      role_id: 1,
    },
  });

  renderLogin();

  await userEvent.type(
    screen.getByPlaceholderText("Enter email"),
    "admin@gmail.com",
  );

  await userEvent.type(screen.getByPlaceholderText("Enter password"), "123456");

  await userEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(localStorage.getItem("token")).toBe("admin-token");

  expect(localStorage.getItem("role_id")).toBe("1");

  expect(mockNavigate).toHaveBeenCalledWith("/admin-dashboard");
});

test("redirects doctor user after successful login", async () => {
  mockedLoginUser.mockResolvedValueOnce({
    success: true,
    message: "Login successful",
    token: "doctor-token",
    user: {
      id: 2,
      email: "doctor@gmail.com",
      role_id: 2,
    },
  });

  renderLogin();

  await userEvent.type(
    screen.getByPlaceholderText("Enter email"),
    "doctor@gmail.com",
  );

  await userEvent.type(screen.getByPlaceholderText("Enter password"), "123456");

  await userEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(mockNavigate).toHaveBeenCalledWith("/doctor-dashboard");
});

test("shows error for invalid role", async () => {
  mockedLoginUser.mockResolvedValueOnce({
    success: true,
    message: "Login successful",
    token: "invalid-role-token",
    user: {
      id: 5,
      email: "unknown@gmail.com",
      role_id: 10,
    },
  });

  renderLogin();

  await userEvent.type(
    screen.getByPlaceholderText("Enter email"),
    "unknown@gmail.com",
  );

  await userEvent.type(screen.getByPlaceholderText("Enter password"), "123456");

  await userEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(await screen.findByText("Invalid user role")).toBeInTheDocument();
});
