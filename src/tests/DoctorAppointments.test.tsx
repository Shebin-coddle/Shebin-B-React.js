import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import * as AppointmentService from "../services/AppointmentService";
import * as PatientService from "../services/PatientService";
import * as MedicalRecordService from "../services/MedicalRecordService";
import * as PrescriptionService from "../services/PrescriptionService";
import * as MedicineService from "../services/MedicineService";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
  updateAppointmentStatus: vi.fn(),
}));

vi.mock("../services/PatientService", () => ({
  getPatientDetailsById: vi.fn(),
}));

vi.mock("../services/MedicalRecordService", () => ({
  getMedicalRecordsByPatientId: vi.fn(),
}));

vi.mock("../services/PrescriptionService", () => ({
  getPrescriptionView: vi.fn(),
}));

vi.mock("../services/MedicineService", () => ({
  getAllMedicines: vi.fn(),
}));

vi.mock("../utils/prescriptionGroup", () => ({
  groupPrescriptions: (data: any) => data,
}));

describe("DoctorAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("user_id", "1");
  });

  const mockAppointments = [
    {
      id: 1,
      doctor_id: 1,
      patient_id: 10,
      appointment_date: "2026-06-25",
      start_time: "10:00",
      end_time: "10:30",
      status: "pending",
    },
  ];

  it("renders appointments", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue(mockAppointments);
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    expect(await screen.findByText("My Appointments")).toBeInTheDocument();
    expect(await screen.findByText("pending")).toBeInTheDocument();
  });

  it("shows empty state when no appointments", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue([]);
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    await waitFor(() => {
      const tbody = document.querySelector("tbody");
      expect(tbody).toBeInTheDocument();
      expect(tbody?.children.length).toBe(0);
    });

    expect(screen.getByText(/page 1 of 0/i)).toBeInTheDocument();
  });

  it("handles API failure", async () => {
    (AppointmentService.getAllAppointments as any).mockRejectedValue(
      new Error("API failed")
    );
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    expect(await screen.findByText(/failed/i)).toBeInTheDocument();
  });

  it("approves appointment", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue(mockAppointments);
    (AppointmentService.updateAppointmentStatus as any).mockResolvedValue({});
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByText("Approve"));

    await waitFor(() => {
      expect(AppointmentService.updateAppointmentStatus).toHaveBeenCalledWith(
        1,
        "booked"
      );
    });
  });

  it("cancels appointment", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue(mockAppointments);
    (AppointmentService.updateAppointmentStatus as any).mockResolvedValue({});
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByText("Cancel"));

    await waitFor(() => {
      expect(AppointmentService.updateAppointmentStatus).toHaveBeenCalledWith(
        1,
        "cancelled"
      );
    });
  });

  it("completes appointment", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue([
      { ...mockAppointments[0], status: "booked" },
    ]);
    (AppointmentService.updateAppointmentStatus as any).mockResolvedValue({});
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByText("Complete"));

    await waitFor(() => {
      expect(AppointmentService.updateAppointmentStatus).toHaveBeenCalledWith(
        1,
        "completed"
      );
    });
  });

  it("renders booked appointment actions", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue([
      { ...mockAppointments[0], status: "booked" },
    ]);
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    expect(await screen.findByText("booked")).toBeInTheDocument();
    expect(screen.getByText("Approve")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("navigates to prescription page", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue(mockAppointments);
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByText("Create Prescription"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/doctor-prescriptions/add/10"
    );
  });

  it("opens patient details modal", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue(mockAppointments);
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    (PatientService.getPatientDetailsById as any).mockResolvedValue({
      first_name: "John",
      last_name: "Doe",
    });

    (MedicalRecordService.getMedicalRecordsByPatientId as any).mockResolvedValue([]);
    (PrescriptionService.getPrescriptionView as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByText("Patient Details"));

    expect(
      await screen.findByText("Selected Patient Details")
    ).toBeInTheDocument();
  });

  it("closes patient modal", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue(mockAppointments);
    (MedicineService.getAllMedicines as any).mockResolvedValue([]);

    (PatientService.getPatientDetailsById as any).mockResolvedValue({
      first_name: "John",
      last_name: "Doe",
    });

    (MedicalRecordService.getMedicalRecordsByPatientId as any).mockResolvedValue([]);
    (PrescriptionService.getPrescriptionView as any).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByText("Patient Details"));

    const modal = await screen.findByText("Selected Patient Details");
const card = modal.closest(".user-detail-card");

expect(card).not.toBeNull();

const closeBtn = within(card as HTMLElement).getByText("Close");

    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(
        screen.queryByText("Selected Patient Details")
      ).not.toBeInTheDocument();
    });
  });
it("renders multiple appointments correctly", async () => {
  (AppointmentService.getAllAppointments as any).mockResolvedValue([
    ...mockAppointments,
    {
      id: 2,
      doctor_id: 1,
      patient_id: 11,
      appointment_date: "2026-06-26",
      start_time: "11:00",
      end_time: "11:30",
      status: "booked",
    },
  ]);

  (MedicineService.getAllMedicines as any).mockResolvedValue([]);

  render(
    <BrowserRouter>
      <DoctorAppointments />
    </BrowserRouter>,
  );

  expect(await screen.findByText("pending")).toBeInTheDocument();
  expect(await screen.findByText("booked")).toBeInTheDocument();
});
  it("loads medicines on mount", async () => {
    (AppointmentService.getAllAppointments as any).mockResolvedValue(mockAppointments);

    const medicineMock = MedicineService.getAllMedicines as any;
    medicineMock.mockResolvedValue([{ id: 1, name: "Paracetamol" }]);

    render(
      <BrowserRouter>
        <DoctorAppointments />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(medicineMock).toHaveBeenCalled();
    });
  });
});