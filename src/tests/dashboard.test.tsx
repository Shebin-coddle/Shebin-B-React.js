import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import NurseDashboard from "../pages/dashboards/NurseDashboard";
import PatientDashboard from "../pages/dashboards/PatientDashboard";

import { getAllAppointments } from "../services/AppointmentService";
import { getAllBills } from "../services/BillService";
import { getMedicalRecordsByPatientId } from "../services/MedicalRecordService";
import { getNurseById } from "../services/NurseService";
import { getAllDepartments } from "../services/DepartmentService";

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
}));

vi.mock("../services/BillService", () => ({
  getAllBills: vi.fn(),
}));

vi.mock("../services/MedicalRecordService", () => ({
  getMedicalRecordsByPatientId: vi.fn(),
}));

vi.mock("../services/NurseService", () => ({
  getNurseById: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
}));

const mockedGetAllAppointments = vi.mocked(getAllAppointments);
const mockedGetAllBills = vi.mocked(getAllBills);
const mockedGetMedicalRecordsByPatientId = vi.mocked(
  getMedicalRecordsByPatientId,
);
const mockedGetNurseById = vi.mocked(getNurseById);
const mockedGetAllDepartments = vi.mocked(getAllDepartments);

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

test("renders doctor dashboard", async () => {
  localStorage.setItem("user_id", "2");

  mockedGetAllAppointments.mockResolvedValue([
    {
      id: 1,
      doctor_id: 2,
      patient_id: 5,
      appointment_date: "2026-05-20",
      start_time: "10:00",
      end_time: "11:00",
      status: "booked",
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
  ]);

  render(<DoctorDashboard />);

  expect(await screen.findByText("Doctor Dashboard")).toBeInTheDocument();
  expect(screen.getByText("My Appointments")).toBeInTheDocument();
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
      status:"completed",
      treatment: "Medicine",
      diagnosis_date: "2026-05-20",
    },
  ]);

  render(<PatientDashboard />);

  expect(await screen.findByText("Patient Dashboard")).toBeInTheDocument();
  expect(screen.getByText("My Appointments")).toBeInTheDocument();
});

test("renders nurse dashboard", async () => {
  localStorage.setItem("user_id", "4");

  mockedGetNurseById.mockResolvedValue({
    user_id: 4,
    salary: 25000,
    department_id: 1,
    created_at: "",
    updated_at: "",
    deleted_at: null,
  });

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  render(<NurseDashboard />);

  expect(await screen.findByText("Nurse Dashboard")).toBeInTheDocument();
  expect(screen.getByText("Cardiology")).toBeInTheDocument();
});