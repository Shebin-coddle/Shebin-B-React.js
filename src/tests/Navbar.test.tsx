import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/home/NavBar";
import { HandleBookAppointments } from "../services/HandleBookAppointments";
import { logout } from "../redux/authSlice";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock("../services/HandleBookAppointments", () => ({
  HandleBookAppointments: vi.fn(),
}));

vi.mock("../redux/authSlice", () => ({
  logout: vi.fn(() => ({ type: "auth/logout" })),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render public layout links and login button when user has no role_id token", () => {
    render(<Navbar />);

    expect(screen.getByText("City Hospital")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();

    expect(screen.queryByText("Overview")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Logout" }),
    ).not.toBeInTheDocument();
  });

  it("should render patient link extensions when role_id matches 3", () => {
    localStorage.setItem("role_id", "3");
    render(<Navbar />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Appointments")).toBeInTheDocument();
    expect(screen.getByText("Bills")).toBeInTheDocument();
    expect(screen.getByText("Medical Records")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("should run HandleBookAppointments execution on custom navigation link click", () => {
    localStorage.setItem("role_id", "3");
    render(<Navbar />);

    const bookLink = screen.getByText("Book Appointment");
    fireEvent.click(bookLink);

    expect(HandleBookAppointments).toHaveBeenCalledTimes(1);
    expect(HandleBookAppointments).toHaveBeenCalledWith(mockNavigate, 3);
  });

  it("should clear application context and dispatch actions correctly on user log out interaction", () => {
    localStorage.setItem("role_id", "3");
    render(<Navbar />);

    const logoutBtn = screen.getByRole("button", { name: "Logout" });
    fireEvent.click(logoutBtn);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalled();
    expect(localStorage.getItem("role_id")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should navigate to brand root route on logo click", () => {
    render(<Navbar />);

    const logoElement = screen.getByText("City Hospital");
    fireEvent.click(logoElement);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should handle login route redirection on anonymous user interaction", () => {
    render(<Navbar />);

    const loginBtn = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  const profileRoles = [
    { id: "1", target: "/admin-profile" },
    { id: "2", target: "/doctor-profile" },
    { id: "3", target: "/patient-profile" },
    { id: "4", target: "/nurse-profile" },
  ];

  profileRoles.forEach(({ id, target }) => {
    it(`should direct toward profile path ${target} matching role identity index ${id}`, () => {
      localStorage.setItem("role_id", id);
      const { container } = render(<Navbar />);

      const profileIcon = container.querySelector(
        ".profile-icon",
      ) as HTMLElement;
      fireEvent.click(profileIcon);

      expect(mockNavigate).toHaveBeenCalledWith(target);
    });
  });
});
