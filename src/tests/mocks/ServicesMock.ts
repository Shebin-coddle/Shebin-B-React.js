import { vi } from "vitest";

export const mockGetAllDepartments = vi.fn();
export const mockGetDoctorsWithDetails = vi.fn();
export const mockCreateAppointment = vi.fn();
export const mockUpdateDepartment = vi.fn();
export const mockGetAllDoctors = vi.fn();
export const mockUpdateDoctor = vi.fn();
export const mockGetAllNurses = vi.fn();
export const mockUpdateNurse = vi.fn();


vi.mock("../../services/DepartmentService", () => ({
  getAllDepartments: mockGetAllDepartments,
  updateDepartment: mockUpdateDepartment,
}));

vi.mock("../../services/DoctorService", () => ({
  getDoctorsWithDetails: mockGetDoctorsWithDetails,
  getAllDoctors: mockGetAllDoctors,
  updateDoctor: mockUpdateDoctor,
}));

vi.mock("../../services/AppointmentService", () => ({
  createAppointment: mockCreateAppointment,
}));

vi.mock("../../services/NurseService", () => ({
  getAllNurses: mockGetAllNurses,
  updateNurse: mockUpdateNurse,
}));