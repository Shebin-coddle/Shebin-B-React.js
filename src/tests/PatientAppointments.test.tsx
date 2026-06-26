import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PatientAppointments from "../pages/patient/PatientAppointments";
import * as AppointmentService from "../services/AppointmentService";
import * as DoctorService from "../services/DoctorService";

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
  updateAppointmentStatus: vi.fn(),
}));

vi.mock("../services/DoctorService", () => ({
  getDoctorsWithDetails: vi.fn(),
}));

describe("PatientAppointments", () => {
  const mockGetAppointments = vi.mocked(AppointmentService.getAllAppointments);
  const mockUpdateAppointment = vi.mocked(
    AppointmentService.updateAppointmentStatus,
  );
  const mockGetDoctors = vi.mocked(DoctorService.getDoctorsWithDetails);

  beforeEach(() => {
    vi.clearAllMocks();

    Storage.prototype.getItem = vi.fn(() => "1");

    globalThis.confirm = vi.fn(() => true);
  });

  it("should display loading state", () => {
    mockGetAppointments.mockResolvedValue([]);
    mockGetDoctors.mockResolvedValue([]);

    render(<PatientAppointments />);

    expect(screen.getByText(/loading appointments/i)).toBeInTheDocument();
  });

  it("should display patient appointments", async () => {
    mockGetDoctors.mockResolvedValue([
      {
        user_id: 2,
        first_name: "John",
        last_name: "Doe",
      },
    ] as any);

    mockGetAppointments.mockResolvedValue([
      {
        id: 1,
        patient_id: 1,
        doctor_id: 2,
        appointment_date: "2026-03-10",
        start_time: "10:00",
        end_time: "10:30",
        status: "pending",
      },
    ] as any);

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText(/my appointments/i)).toBeInTheDocument();
    });

    expect(screen.getByText("DR. JOHN DOE")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /cancel appointment/i,
      }),
    ).toBeInTheDocument();
  });

  it("should cancel an appointment", async () => {
    mockGetDoctors.mockResolvedValue([
      {
        user_id: 2,
        first_name: "John",
        last_name: "Doe",
      },
    ] as any);

    mockGetAppointments.mockResolvedValue([
      {
        id: 1,
        patient_id: 1,
        doctor_id: 2,
        appointment_date: "2026-03-10",
        start_time: "10:00",
        end_time: "10:30",
        status: "pending",
      },
    ] as any);

    mockUpdateAppointment.mockResolvedValue(undefined);

    render(<PatientAppointments />);

    const button = await screen.findByRole("button", {
      name: /cancel appointment/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateAppointment).toHaveBeenCalledWith(1, "cancelled");
    });
  });

  it("should display an error when fetching fails", async () => {
    mockGetAppointments.mockRejectedValue(
      new Error("Failed to fetch appointments"),
    );

    mockGetDoctors.mockResolvedValue([]);

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch appointments/i),
      ).toBeInTheDocument();
    });
  });

  it("should show no appointments message", async () => {
    mockGetAppointments.mockResolvedValue([]);
    mockGetDoctors.mockResolvedValue([]);

    render(<PatientAppointments />);

    await waitFor(() => {
      expect(screen.getByText(/no appointments found/i)).toBeInTheDocument();
    });
  });
});
