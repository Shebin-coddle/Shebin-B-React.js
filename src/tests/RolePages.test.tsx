import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import PatientBills from "../pages/patient/PatientBills";
import PatientBookAppointment from "../pages/patient/PatientBookAppointment";
import PatientMedicalRecords from "../pages/patient/PatientMedicalRecords";

import { getAllBills } from "../services/BillService";
import { getMedicalRecordsByPatientId } from "../services/MedicalRecordService";
import { getAllDepartments } from "../services/DepartmentService";
import { getDoctorsWithDetails } from "../services/DoctorService";
import { createAppointment } from "../services/AppointmentService";

vi.mock("../services/BillService", () => ({
  getAllBills: vi.fn(),
}));

vi.mock("../services/MedicalRecordService", () => ({
  getMedicalRecordsByPatientId: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
}));

vi.mock("../services/DoctorService", () => ({
  getDoctorsWithDetails: vi.fn(),
}));

vi.mock("../services/AppointmentService", () => ({
  createAppointment: vi.fn(),
}));

const mockedGetAllBills = vi.mocked(getAllBills);
const mockedGetMedicalRecordsByPatientId = vi.mocked(
  getMedicalRecordsByPatientId,
);
const mockedGetAllDepartments = vi.mocked(getAllDepartments);
const mockedGetDoctorsWithDetails = vi.mocked(getDoctorsWithDetails);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.setItem("token", "test-token");
  localStorage.setItem("user_id", "5");
});

test("renders patient bills page", async () => {
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

  render(<PatientBills />);

  expect(await screen.findByText("My Bills")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Pay" })).toBeInTheDocument();
});

test("renders patient medical records page", async () => {
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

  render(<PatientMedicalRecords />);

  expect(await screen.findByText("My Medical Records")).toBeInTheDocument();
  expect(screen.getByText("Fever")).toBeInTheDocument();
  expect(screen.getByText("Medicine")).toBeInTheDocument();
});

test("renders patient book appointment page", async () => {
  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([
    {
      user_id: 2,
      first_name: "John",
      last_name: "Doe",
      specialization: "Cardiology",
      department_id: 1,
    },
  ]);

  render(<PatientBookAppointment />);

  expect(await screen.findByRole("heading")).toBeInTheDocument();

  fireEvent.change(screen.getByDisplayValue("Select Department"), {
    target: { value: "1" },
  });

  expect(screen.getByText(/Dr. John Doe/)).toBeInTheDocument();
});

test("shows validation error when booking empty appointment form", async () => {
  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([]);

  render(<PatientBookAppointment />);

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("Please select a department"),
  ).toBeInTheDocument();
});

test("opens patient medical record details", async () => {
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

  render(<PatientMedicalRecords />);

  fireEvent.click(await screen.findByRole("button", { name: "View" }));

  expect(screen.getByText("Selected Medical Record")).toBeInTheDocument();
  expect(screen.getAllByText("Fever").length).toBeGreaterThan(0);
});

const mockedCreateAppointment = vi.mocked(createAppointment);

test("shows patient id missing error while booking appointment", async () => {
  localStorage.removeItem("user_id");

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([]);

  render(<PatientBookAppointment />);

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("Patient ID not found. Please login again."),
  ).toBeInTheDocument();
});

test("books appointment successfully", async () => {
  localStorage.setItem("user_id", "5");

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([
    {
      user_id: 2,
      first_name: "John",
      last_name: "Doe",
      specialization: "Cardiology",
      department_id: 1,
    },
  ]);

  mockedCreateAppointment.mockResolvedValue(undefined);

  render(<PatientBookAppointment />);

  fireEvent.change(await screen.findByDisplayValue("Select Department"), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByDisplayValue("Select Doctor"), {
    target: { value: "2" },
  });

  const inputs = screen.getAllByDisplayValue("");

  fireEvent.change(inputs[0], {
    target: { value: "2026-12-20" },
  });

  const timeInputs = screen.getAllByDisplayValue("");

  fireEvent.change(timeInputs[0], {
    target: { value: "10:00" },
  });

  fireEvent.change(timeInputs[1], {
    target: { value: "11:00" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("Appointment request submitted successfully"),
  ).toBeInTheDocument();
});

test("shows select doctor error", async () => {
  localStorage.setItem("user_id", "5");

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([
    {
      user_id: 2,
      first_name: "John",
      last_name: "Doe",
      specialization: "Cardiology",
      department_id: 1,
    },
  ]);

  render(<PatientBookAppointment />);

  fireEvent.change(await screen.findByDisplayValue("Select Department"), {
    target: { value: "1" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("Please select a doctor"),
  ).toBeInTheDocument();
});

test("shows appointment date required error", async () => {
  localStorage.setItem("user_id", "5");

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([
    {
      user_id: 2,
      first_name: "John",
      last_name: "Doe",
      specialization: "Cardiology",
      department_id: 1,
    },
  ]);

  render(<PatientBookAppointment />);

  fireEvent.change(await screen.findByDisplayValue("Select Department"), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByDisplayValue("Select Doctor"), {
    target: { value: "2" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("Please select appointment date"),
  ).toBeInTheDocument();
});

test("shows past date error", async () => {
  localStorage.setItem("user_id", "5");

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([
    {
      user_id: 2,
      first_name: "John",
      last_name: "Doe",
      specialization: "Cardiology",
      department_id: 1,
    },
  ]);

  render(<PatientBookAppointment />);

  fireEvent.change(await screen.findByDisplayValue("Select Department"), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByDisplayValue("Select Doctor"), {
    target: { value: "2" },
  });

  const inputs = screen.getAllByDisplayValue("");

  fireEvent.change(inputs[0], {
    target: { value: "2020-01-01" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("Appointment date cannot be in the past"),
  ).toBeInTheDocument();
});

test("shows start time required error", async () => {
  localStorage.setItem("user_id", "5");

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([
    {
      user_id: 2,
      first_name: "John",
      last_name: "Doe",
      specialization: "Cardiology",
      department_id: 1,
    },
  ]);

  render(<PatientBookAppointment />);

  fireEvent.change(await screen.findByDisplayValue("Select Department"), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByDisplayValue("Select Doctor"), {
    target: { value: "2" },
  });

  const inputs = screen.getAllByDisplayValue("");

  fireEvent.change(inputs[0], {
    target: { value: "2030-12-20" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("Please select start time"),
  ).toBeInTheDocument();
});

test("shows end time required error", async () => {
  localStorage.setItem("user_id", "5");

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([
    {
      user_id: 2,
      first_name: "John",
      last_name: "Doe",
      specialization: "Cardiology",
      department_id: 1,
    },
  ]);

  render(<PatientBookAppointment />);

  fireEvent.change(await screen.findByDisplayValue("Select Department"), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByDisplayValue("Select Doctor"), {
    target: { value: "2" },
  });

  const inputs = screen.getAllByDisplayValue("");

  fireEvent.change(inputs[0], {
    target: { value: "2030-12-20" },
  });

  fireEvent.change(inputs[1], {
    target: { value: "10:00" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("Please select end time"),
  ).toBeInTheDocument();
});

test("shows invalid time range error", async () => {
  localStorage.setItem("user_id", "5");

  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  mockedGetDoctorsWithDetails.mockResolvedValue([
    {
      user_id: 2,
      first_name: "John",
      last_name: "Doe",
      specialization: "Cardiology",
      department_id: 1,
    },
  ]);

  render(<PatientBookAppointment />);

  fireEvent.change(await screen.findByDisplayValue("Select Department"), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByDisplayValue("Select Doctor"), {
    target: { value: "2" },
  });

  const inputs = screen.getAllByDisplayValue("");

  fireEvent.change(inputs[0], {
    target: { value: "2030-12-20" },
  });

  fireEvent.change(inputs[1], {
    target: { value: "11:00" },
  });

  fireEvent.change(inputs[2], {
    target: { value: "10:00" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Book Appointment" }));

  expect(
    await screen.findByText("End time must be after start time"),
  ).toBeInTheDocument();
});
