import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import { LoginUser } from "../services/AuthService";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/AuthService", () => ({
  LoginUser: vi.fn(),
}));

const mockedLoginUser = vi.mocked(LoginUser);

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear();
  mockedLoginUser.mockReset();
});

test("renders login form", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
});

test("allows user to type email and password", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "admin@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  expect(screen.getByLabelText("Email")).toHaveValue("admin@gmail.com");
  expect(screen.getByLabelText("Password")).toHaveValue("123456");
});

test("shows error message when login fails", async () => {
  mockedLoginUser.mockRejectedValue(new Error("Invalid email or password"));

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "wrong@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(
    await screen.findByText("Invalid email or password"),
  ).toBeInTheDocument();
});

test("redirects admin user after successful login", async () => {
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

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "admin@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/admin-dashboard");
  });

  expect(localStorage.getItem("token")).toBe("test-token");
  expect(localStorage.getItem("role_id")).toBe("1");
  expect(localStorage.getItem("user_id")).toBe("1");
});

test("redirects doctor user after successful login", async () => {
mockedLoginUser.mockResolvedValue({
  success: true,
  message: "Login successful",
  token: "doctor-token",
  user: {
    id: 2,
    email: "doctor@gmail.com",
    role_id: 2,
  },
});

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "doctor@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/doctor-dashboard");
  });
});

test("shows error for invalid role", async () => {
mockedLoginUser.mockResolvedValue({
  success: true,
  message: "Login successful",
  token: "test-token",
  user: {
    id: 10,
    email: "user@gmail.com",
    role_id: 99,
  },
});

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "user@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  expect(await screen.findByText("Invalid user role")).toBeInTheDocument();
});