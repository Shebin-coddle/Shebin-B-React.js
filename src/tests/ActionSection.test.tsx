import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ActionSection from "../components/home/ActionSection";
import { HandleBookAppointments } from "../services/HandleBookAppointments";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../services/HandleBookAppointments", () => ({
  HandleBookAppointments: vi.fn(),
}));

describe("ActionSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render promotional copy layout text correctly", () => {
    render(<ActionSection />);

    expect(screen.getByText("Need Medical Assistance?")).toBeInTheDocument();
    expect(
      screen.getByText(/Book an Appointment with Our/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Book Appointment" }),
    ).toBeInTheDocument();
  });

  it("should trigger HandleBookAppointments utility structure with mock params when button is clicked", () => {
    localStorage.setItem("role_id", "3");
    render(<ActionSection />);

    const bookButton = screen.getByRole("button", { name: "Book Appointment" });
    fireEvent.click(bookButton);

    expect(HandleBookAppointments).toHaveBeenCalledTimes(1);
    expect(HandleBookAppointments).toHaveBeenCalledWith(mockNavigate, 3);
  });
});
