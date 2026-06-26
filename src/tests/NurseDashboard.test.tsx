import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import NurseDashboard from "../pages/dashboards/NurseDashboard";

import * as NurseService from "../services/NurseService";
import * as DepartmentService from "../services/DepartmentService";

vi.mock("../services/NurseService", () => ({
  getNurseById: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
}));

vi.mock("../components/dashboard/DashboardCard", () => ({
  default: ({
    title,
    count,
  }: {
    title: string;
    count: string | number;
  }) => (
    <div>
      <h3>{title}</h3>
      <span>{count}</span>
    </div>
  ),
}));

describe("NurseDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("user_id", "1");
  });

  it("shows loading initially", () => {
    vi.mocked(NurseService.getNurseById).mockImplementation(
      () => new Promise(() => {})
    );

    render(<NurseDashboard />);

    expect(
      screen.getByText(/Loading nurse dashboard/i)
    ).toBeInTheDocument();
  });

  it("renders nurse department details", async () => {
    vi.mocked(NurseService.getNurseById).mockResolvedValue({
      id: 1,
      department_id: 2,
    } as any);

    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue([
      {
        id: 2,
        department_name: "Cardiology",
        contact_number: "9876543210",
      },
    ] as any);

    render(<NurseDashboard />);

    expect(await screen.findByText("Overview")).toBeInTheDocument();

    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();

    expect(screen.getByText("Department Contact")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
  });

  it("shows N/A when department is not found", async () => {
    vi.mocked(NurseService.getNurseById).mockResolvedValue({
      id: 1,
      department_id: 99,
    } as any);

    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue([
      {
        id: 2,
        department_name: "Cardiology",
        contact_number: "9876543210",
      },
    ] as any);

    render(<NurseDashboard />);

    await screen.findByText("Overview");

    const naValues = screen.getAllByText("N/A");
    expect(naValues).toHaveLength(2);
  });

  it("shows error when API fails", async () => {
    vi.mocked(NurseService.getNurseById).mockRejectedValue(
      new Error("Failed to fetch dashboard")
    );

    render(<NurseDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch dashboard")
      ).toBeInTheDocument();
    });
  });
});