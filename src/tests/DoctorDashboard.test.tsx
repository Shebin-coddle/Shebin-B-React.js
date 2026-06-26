import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import * as AppointmentService from "../services/AppointmentService";

beforeEach(() => {
  Storage.prototype.getItem = vi.fn(() => "1");
});

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
}));

describe("DoctorDashboard", () => {
  const mockGetAllAppointments = vi.mocked(
    AppointmentService.getAllAppointments
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    mockGetAllAppointments.mockReturnValue(new Promise(() => {}));

    render(<DoctorDashboard />);

    expect(
      screen.getByText(/loading doctor dashboard/i)
    ).toBeInTheDocument();
  });

  it("should display dashboard cards after fetching appointments", async () => {
    mockGetAllAppointments.mockResolvedValue([
      { id: 1, doctor_id: 1, status: "booked" },
      { id: 2, doctor_id: 1, status: "pending" },
      { id: 3, doctor_id: 1, status: "booked" },
      { id: 4, doctor_id: 2, status: "booked" }, 
    ] as any);

    render(<DoctorDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/overview/i)).toBeInTheDocument();
    });

    expect(screen.getByText("3")).toBeInTheDocument(); 
    expect(screen.getByText("2")).toBeInTheDocument(); 
    expect(screen.getByText("1")).toBeInTheDocument(); 
  });

  it("should display error message when fetch fails", async () => {
    mockGetAllAppointments.mockRejectedValue(
      new Error("Failed to fetch appointments")
    );

    render(<DoctorDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch appointments/i)
      ).toBeInTheDocument();
    });
  });
});