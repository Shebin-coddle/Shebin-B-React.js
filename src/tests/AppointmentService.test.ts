import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllAppointments,
  updateAppointment,
  updateAppointmentStatus,
  createAppointment,
  getAppointmentById,
  removeAppointment,
} = await vi.importActual<typeof import("../services/AppointmentService")>("../services/AppointmentService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("AppointmentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return appointments from appointments field in getAllAppointments", async () => {
    const mockData = { appointments: [{ id: 1, status: "booked" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllAppointments();
    expect(api.get).toHaveBeenCalledWith("/appointment/get-allappointments");
    expect(result).toEqual(mockData.appointments);
  });

  it("should return appointments from data field in getAllAppointments if appointments field missing", async () => {
    const mockData = { data: [{ id: 2, status: "completed" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllAppointments();
    expect(result).toEqual(mockData.data);
  });

  it("should return response data directly in getAllAppointments if both structural fields missing", async () => {
    const mockData = [{ id: 3, status: "cancelled" }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllAppointments();
    expect(result).toEqual(mockData);
  });

  it("should put update payload to edit endpoint in updateAppointment", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const payload = {
      doctor_id: 1,
      patient_id: 2,
      appointment_date: "2026-06-25",
      start_time: "10:00",
      end_time: "10:30",
      status: "booked" as const,
    };

    await updateAppointment(12, payload);
    expect(api.put).toHaveBeenCalledWith("/appointment/edit-appointment/12", payload);
  });

  it("should put formatted status payload to edit endpoint in updateAppointmentStatus", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });

    await updateAppointmentStatus(14, "cancelled");
    expect(api.put).toHaveBeenCalledWith("/appointment/edit-appointment/14", { status: "cancelled" });
  });

  it("should post creation payload to add endpoint in createAppointment", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    const payload = {
      doctor_id: 1,
      patient_id: 2,
      appointment_date: "2026-06-25",
      start_time: "10:00",
      end_time: "10:30",
      status: "booked" as const,
    };

    await createAppointment(payload);
    expect(api.post).toHaveBeenCalledWith("/appointment/add-appointment", payload);
  });

  it("should return appointment from appointment field in getAppointmentById", async () => {
    const mockData = { appointment: { id: 5 } };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAppointmentById(5);
    expect(api.get).toHaveBeenCalledWith("/appointment/get-appointment/5");
    expect(result).toEqual(mockData.appointment);
  });

  it("should return appointment from data field in getAppointmentById if appointment missing", async () => {
    const mockData = { data: { id: 6 } };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAppointmentById(6);
    expect(result).toEqual(mockData.data);
  });

  it("should return raw response data in getAppointmentById if fallback fields are missing", async () => {
    const mockData = { id: 7 };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAppointmentById(7);
    expect(result).toEqual(mockData);
  });

  it("should trigger deletion request and return details in removeAppointment", async () => {
    const mockResponse = { success: true };
    vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

    const result = await removeAppointment(9);
    expect(api.delete).toHaveBeenCalledWith("/Appointment/remove-appointment/9");
    expect(result).toEqual(mockResponse);
  });
});