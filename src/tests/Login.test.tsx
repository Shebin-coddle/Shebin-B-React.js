import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Login from "../pages/Login";
import * as AuthService from "../services/AuthService";
import authReducer from "../redux/authSlice";

vi.mock("../services/AuthService");
vi.mock("../utils/toast");

vi.mock("../components/Home/NavBar", () => ({
  default: () => <nav data-testid="navbar" />,
}));

vi.mock("../components/Home/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

function renderLogin() {
  const store = configureStore({ reducer: { auth: authReducer } });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  const form = screen.getByTestId("login-form");

  return {
    user: userEvent.setup(),
    form,
    utils: within(form),
  };
}

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation errors when form is empty", async () => {
    const { user, utils } = renderLogin();

    await user.click(utils.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/email is required/i)
    ).toBeInTheDocument();
  });

  it("navigates to admin dashboard on successful login", async () => {
    const { user, utils } = renderLogin();

    (AuthService.LoginUser as any).mockResolvedValue({
      token: "fake-token",
      user: { id: 1, role_id: 1 },
    });

    await user.type(utils.getByLabelText(/email/i), "admin@example.com");
    await user.type(utils.getByLabelText(/password/i), "password123");

    await user.click(utils.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/admin-dashboard");
    });
  });

  it("shows error message on failed login", async () => {
    const { user, utils } = renderLogin();

    (AuthService.LoginUser as any).mockRejectedValue(
      new Error("Invalid credentials")
    );

    await user.type(utils.getByLabelText(/email/i), "wrong@example.com");
    await user.type(utils.getByLabelText(/password/i), "wrongpass");

    await user.click(utils.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/invalid credentials/i)
    ).toBeInTheDocument();
  });
});