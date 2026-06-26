import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Hero from "../components/home/HeroSection";
import { HandleBookAppointments } from "../services/HandleBookAppointments";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../services/HandleBookAppointments", () => ({
  HandleBookAppointments: vi.fn(),
}));

describe("Hero Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render copy headers, stats text, and background images cleanly", () => {
    render(<Hero />);

    expect(
      screen.getByText("Trusted Healthcare Since 1970"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Your Health Is Our/i)).toBeInTheDocument();

    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(screen.getByText("10K+")).toBeInTheDocument();
    expect(screen.getByText("20+")).toBeInTheDocument();

    const imageElement = screen.getByAltText("Hospital Doctors");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute("src")).toContain("image-1.jpg");
  });

  it("should call HandleBookAppointments utility with storage details on click", () => {
    localStorage.setItem("role_id", "2");
    render(<Hero />);

    const bookBtn = screen.getByRole("button", { name: "Book Appointment" });
    fireEvent.click(bookBtn);

    expect(HandleBookAppointments).toHaveBeenCalledTimes(1);
    expect(HandleBookAppointments).toHaveBeenCalledWith(mockNavigate, 2);
  });

  it("should route the user to about layout path when clicking secondary control button", () => {
    render(<Hero />);

    const learnMoreBtn = screen.getByRole("button", { name: "Learn More" });
    fireEvent.click(learnMoreBtn);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/about");
  });
});
