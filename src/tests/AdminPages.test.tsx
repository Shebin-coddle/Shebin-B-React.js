import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import AdminAppointments from "../pages/admin/AdminAppointment";
import AdminBills from "../pages/admin/AdminBills";
import AdminDepartments from "../pages/admin/AdminDepartment";
import AdminDoctors from "../pages/admin/AdminDoctor";
import AdminMedicines from "../pages/admin/AdminMedicine";
import AdminNurses from "../pages/admin/AdminNurse";
import AdminPatients from "../pages/admin/AdminPatient";
import AdminUsers from "../pages/admin/AdminUsers";

import { getAllAppointments } from "../services/AppointmentService";
import { getAllBills } from "../services/BillService";
import { getAllDepartments } from "../services/DepartmentService";
import { getAllDoctors } from "../services/DoctorService";
import { getAllMedicines } from "../services/MedicineService";
import { getAllNurses } from "../services/NurseService";
import { getAllPatients } from "../services/PatientService";
import { getAllUsers } from "../services/UserService";

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock("../services/DoctorService", () => ({
  getAllDoctors: vi.fn(),
  updateDoctor: vi.fn(),
}));

vi.mock("../services/PatientService", () => ({
  getAllPatients: vi.fn(),
  updatePatient: vi.fn(),
}));

vi.mock("../services/NurseService", () => ({
  getAllNurses: vi.fn(),
  updateNurse: vi.fn(),
}));

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
  updateAppointment: vi.fn(),
}));

vi.mock("../services/BillService", () => ({
  getAllBills: vi.fn(),
  updateBill: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
  updateDepartment: vi.fn(),
}));

vi.mock("../services/MedicineService", () => ({
  getAllMedicines: vi.fn(),
  updateMedicine: vi.fn(),
}));

const mockedGetAllUsers = vi.mocked(getAllUsers);
const mockedGetAllDoctors = vi.mocked(getAllDoctors);
const mockedGetAllPatients = vi.mocked(getAllPatients);
const mockedGetAllNurses = vi.mocked(getAllNurses);
const mockedGetAllAppointments = vi.mocked(getAllAppointments);
const mockedGetAllBills = vi.mocked(getAllBills);
const mockedGetAllDepartments = vi.mocked(getAllDepartments);
const mockedGetAllMedicines = vi.mocked(getAllMedicines);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.setItem("token", "test-token");
});

test("renders admin users page and opens view and edit", async () => {
  mockedGetAllUsers.mockResolvedValue([
    {
      id: 1,
      first_name: "Admin",
      last_name: "User",
      email: "admin@gmail.com",
      phone: "1234567890",
      role_id: 1,
    },
  ]);

  render(<AdminUsers />);

  expect(await screen.findByText("Users")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View"));
  expect(screen.getByText("Selected User Details")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  fireEvent.click(screen.getByText("Edit"));
  expect(screen.getByText("Edit User")).toBeInTheDocument();
  expect(screen.getByDisplayValue("admin@gmail.com")).toBeInTheDocument();
});

test("renders admin doctors page and opens view and edit", async () => {
  mockedGetAllDoctors.mockResolvedValue([
    {
      user_id: 2,
      specialization: "Cardiology",
      salary: 50000,
      department_id: 1,
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
  ]);

  render(<AdminDoctors />);

  expect(await screen.findByText("Doctors")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View"));
  expect(screen.getByText("Selected Doctor Details")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  fireEvent.click(screen.getByText("Edit"));
  expect(screen.getByText("Edit Doctor")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Cardiology")).toBeInTheDocument();
});

test("renders admin patients page and opens view and edit", async () => {
  mockedGetAllPatients.mockResolvedValue([
    {
      user_id: 3,
      dob: "2000-01-01",
      blood_group: "O+",
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
  ]);

  render(<AdminPatients />);

  expect(await screen.findByText("Patients")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View"));
  expect(screen.getByText("Selected Patient Details")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  fireEvent.click(screen.getByText("Edit"));
  expect(screen.getByText("Edit Patient")).toBeInTheDocument();
  expect(screen.getByDisplayValue("O+")).toBeInTheDocument();
});

test("renders admin nurses page and opens view and edit", async () => {
  mockedGetAllNurses.mockResolvedValue([
    {
      user_id: 4,
      salary: 25000,
      department_id: 1,
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
  ]);

  render(<AdminNurses />);

  expect(await screen.findByText("Nurses")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View"));
  expect(screen.getByText("Selected Nurse Details")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  fireEvent.click(screen.getByText("Edit"));
  expect(screen.getByText("Edit Nurse")).toBeInTheDocument();
  expect(screen.getByDisplayValue(25000)).toBeInTheDocument();
});

test("renders admin appointments page and opens view and edit", async () => {
  mockedGetAllAppointments.mockResolvedValue([
    {
      id: 1,
      doctor_id: 2,
      patient_id: 3,
      appointment_date: "2026-05-20",
      start_time: "10:00",
      end_time: "11:00",
      status: "pending",
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
  ]);

  render(<AdminAppointments />);

  expect(await screen.findByText("Appointments")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View"));
  expect(screen.getByText("Selected Appointment Details")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  fireEvent.click(screen.getByText("Edit"));
  expect(screen.getByText("Edit Appointment")).toBeInTheDocument();
expect(screen.getByDisplayValue("2026-05-20")).toBeInTheDocument();});

test("renders admin bills page and opens view and edit", async () => {
  mockedGetAllBills.mockResolvedValue([
    {
      id: 1,
      patient_id: 3,
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

  render(<AdminBills />);

  expect(await screen.findByText("Bills")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View"));
  expect(screen.getByText("Selected Bill Details")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  fireEvent.click(screen.getByText("Edit"));
  expect(screen.getByText("Edit Bill")).toBeInTheDocument();
  expect(screen.getByDisplayValue(500)).toBeInTheDocument();
});

test("renders admin departments page and opens view and edit", async () => {
  mockedGetAllDepartments.mockResolvedValue([
    {
      id: 1,
      department_name: "Cardiology",
      contact_number: "9876543210",
      created_at: "",
    },
  ]);

  render(<AdminDepartments />);

  expect(await screen.findByText("Departments")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View"));
  expect(screen.getByText("Selected Department Details")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  fireEvent.click(screen.getByText("Edit"));
  expect(screen.getByText("Edit Department")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Cardiology")).toBeInTheDocument();
});

test("renders admin medicines page and opens view and edit", async () => {
  mockedGetAllMedicines.mockResolvedValue([
    {
      id: 1,
      medicine_name: "Paracetamol",
      description: "Fever medicine",
      stock: 100,
      expiry_date: "2027-01-01",
      created_at: "",
      deleted_at: null,
    },
  ]);

  render(<AdminMedicines />);

  expect(await screen.findByText("Medicines")).toBeInTheDocument();

  fireEvent.click(screen.getByText("View"));
  expect(screen.getByText("Selected Medicine Details")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  fireEvent.click(screen.getByText("Edit"));
  expect(screen.getByText("Edit Medicine")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Paracetamol")).toBeInTheDocument();
});