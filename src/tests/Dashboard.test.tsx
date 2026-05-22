import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import AdminDashboard from "../pages/dashboards/AdminDashboard";
import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import NurseDashboard from "../pages/dashboards/NurseDashboard";
import PatientDashboard from "../pages/dashboards/PatientDashboard";

import { getAllAppointments } from "../services/AppointmentService";
import { getAllBills } from "../services/BillService";
import { getMedicalRecordsByPatientId } from "../services/MedicalRecordService";
import { getAdminDashboardSummary } from "../services/DashboardService";

vi.mock("../services/DashboardService", () => ({
  getAdminDashboardSummary: vi.fn(),
}));

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
}));

vi.mock("../services/BillService", () => ({
  getAllBills: vi.fn(),
}));

vi.mock("../services/MedicalRecordService", () => ({
  getMedicalRecordsByPatientId: vi.fn(),
}));

const mockedGetAdminDashboardSummary = vi.mocked(getAdminDashboardSummary);
const mockedGetAllAppointments = vi.mocked(getAllAppointments);
const mockedGetAllBills = vi.mocked(getAllBills);
const mockedGetMedicalRecordsByPatientId = vi.mocked(
  getMedicalRecordsByPatientId,
);

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

test("renders admin dashboard", async () => {
  mockedGetAdminDashboardSummary.mockResolvedValue({
    totalUsers: 5,
    totalDoctors: 2,
    totalPatients: 3,
    totalNurses: 1,
    totalAppointments: 4,
    totalBills: 2,
    totalDepartments: 2,
    totalMedicines: 6,
  });

  render(<AdminDashboard />);

  expect(await screen.findByText("Overview")).toBeInTheDocument();
  expect(screen.getByText("Total Users")).toBeInTheDocument();
  expect(screen.getByText("Total Doctors")).toBeInTheDocument();
  expect(screen.getByText("Total Patients")).toBeInTheDocument();
  expect(screen.getByText("Total Nurses")).toBeInTheDocument();
});

test("renders patient dashboard", async () => {
  localStorage.setItem("user_id", "5");

  mockedGetAllAppointments.mockResolvedValue([
    {
      id: 1,
      doctor_id: 2,
      patient_id: 5,
      appointment_date: "2026-05-20",
      start_time: "10:00",
      end_time: "11:00",
      status: "pending",
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
  ]);

  mockedGetAllBills.mockResolvedValue([
    {
      id: 1,
      patient_id: 5,
      fee_id: 1,
      amount: 500,
      date: "2026-05-20",
      description: "Consultation",
      status: "pending",
      mode_of_payment: "cash",
      created_at: "",
      updated_at: "",
    },
  ]);

  mockedGetMedicalRecordsByPatientId.mockResolvedValue([
    {
      id: 1,
      patient_id: 5,
      doctor_id: 2,
      medical_condition: "Fever",
      treatment: "Medicine",
      status: "completed",
      diagnosis_date: "2026-05-20",
    },
  ]);

  render(<PatientDashboard />);

  expect(await screen.findByText("Patient Dashboard")).toBeInTheDocument();
  expect(screen.getByText("My Appointments")).toBeInTheDocument();
  expect(screen.getByText("Pending Appointments")).toBeInTheDocument();
  expect(screen.getByText("Pending Bills")).toBeInTheDocument();
  expect(screen.getByText("Medical Records")).toBeInTheDocument();
});

test("renders doctor dashboard", () => {
  render(<DoctorDashboard />);

  expect(screen.getByText("Doctor Dashboard")).toBeInTheDocument();
  expect(screen.getByText("Login successful")).toBeInTheDocument();
});

test("renders nurse dashboard", () => {
  render(<NurseDashboard />);

  expect(screen.getByText("Nurse Dashboard")).toBeInTheDocument();
  expect(screen.getByText("Login successful")).toBeInTheDocument();
});

test("shows admin dashboard error message", async () => {
  mockedGetAdminDashboardSummary.mockRejectedValue(
    new Error("Failed to load dashboard"),
  );

  render(<AdminDashboard />);

  expect(await screen.findByText("Failed to load dashboard")).toBeInTheDocument();
});

test("shows no dashboard data found when summary is null", async () => {
  mockedGetAdminDashboardSummary.mockResolvedValue(null as never);

  render(<AdminDashboard />);

  expect(await screen.findByText("No dashboard data found")).toBeInTheDocument();
});