import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PatientDashboard from "../pages/dashboards/PatientDashboard";
import * as AppointmentService from "../services/AppointmentService";
import * as BillService from "../services/BillService";
import * as MedicalRecordService from "../services/MedicalRecordService";

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
}));

vi.mock("../services/BillService", () => ({
  getAllBills: vi.fn(),
}));

vi.mock("../services/MedicalRecordService", () => ({
  getMedicalRecordsByPatientId: vi.fn(),
}));

vi.mock("../components/dashboard/DashboardCard", () => ({
  default: ({ title, count }: { title: string; count: string | number }) => (
    <div>
      <h3>{title}</h3>
      <span>{count}</span>
    </div>
  ),
}));

describe("PatientDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("user_id", "1");
  });

  it("shows loading state", () => {
    vi.mocked(AppointmentService.getAllAppointments).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<PatientDashboard />);

    expect(screen.getByText(/Loading patient dashboard/i)).toBeInTheDocument();
  });

  it("renders dashboard counts", async () => {
    vi.mocked(AppointmentService.getAllAppointments).mockResolvedValue([
      {
        id: 1,
        patient_id: 1,
        status: "pending",
      },
      {
        id: 2,
        patient_id: 1,
        status: "booked",
      },
      {
        id: 3,
        patient_id: 2,
        status: "pending",
      },
    ] as any);

    vi.mocked(BillService.getAllBills).mockResolvedValue([
      {
        id: 1,
        patient_id: 1,
        status: "pending",
      },
      {
        id: 2,
        patient_id: 1,
        status: "completed",
      },
      {
        id: 3,
        patient_id: 2,
        status: "pending",
      },
    ] as any);

    vi.mocked(
      MedicalRecordService.getMedicalRecordsByPatientId,
    ).mockResolvedValue([{ id: 1 }, { id: 2 }] as any);

    render(<PatientDashboard />);

    expect(await screen.findByText("Overview")).toBeInTheDocument();

    expect(screen.getByText("My Appointments")).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getByText("Pending Appointments")).toBeInTheDocument();
    expect(screen.getAllByText("1")).toHaveLength(3);
    expect(screen.getByText("Booked Appointments")).toBeInTheDocument();

    expect(screen.getByText("Pending Bills")).toBeInTheDocument();

    expect(screen.getByText("Medical Records")).toBeInTheDocument();
  });

  it("shows zero counts when no data exists", async () => {
    vi.mocked(AppointmentService.getAllAppointments).mockResolvedValue([]);
    vi.mocked(BillService.getAllBills).mockResolvedValue([]);
    vi.mocked(
      MedicalRecordService.getMedicalRecordsByPatientId,
    ).mockResolvedValue([]);

    render(<PatientDashboard />);

    await screen.findByText("Overview");

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(5);
  });

  it("shows error when API fails", async () => {
    vi.mocked(AppointmentService.getAllAppointments).mockRejectedValue(
      new Error("Failed to load dashboard"),
    );

    render(<PatientDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load dashboard")).toBeInTheDocument();
    });
  });
});
