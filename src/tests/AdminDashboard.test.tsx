import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import * as DashboardService from "../services/DashboardService";

vi.mock("../services/DashboardService", () => ({
  getAdminDashboardSummary: vi.fn(),
}));

describe("AdminDashboard", () => {
  const mockGetSummary = vi.mocked(
    DashboardService.getAdminDashboardSummary
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    mockGetSummary.mockReturnValue(new Promise(() => {}));

    render(<AdminDashboard />);

    expect(
      screen.getByText(/loading dashboard/i)
    ).toBeInTheDocument();
  });

  it("should display dashboard cards when data is fetched successfully", async () => {
    mockGetSummary.mockResolvedValue({
      totalUsers: 10,
      totalDoctors: 5,
      totalPatients: 20,
      totalNurses: 8,
      totalAppointments: 50,
      totalBills: 100,
      totalDepartments: 4,
      totalMedicines: 200,
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/overview/i)).toBeInTheDocument();
    });

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should display error message when fetch fails", async () => {
    mockGetSummary.mockRejectedValue(new Error("Failed to fetch"));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch/i)
      ).toBeInTheDocument();
    });
  });
});