import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllDoctors,
  updateDoctor,
  getDoctorsWithDetails,
  createDoctor,
  removeDoctor,
} = await vi.importActual<typeof import("../services/DoctorService")>("../services/DoctorService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("DoctorService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return doctor records array from data property in getAllDoctors", async () => {
    const mockData = { data: [{ id: 1, name: "Dr. Smith" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllDoctors();
    expect(api.get).toHaveBeenCalledWith("/doctor/get-alldoctors");
    expect(result).toEqual(mockData.data);
  });

  it("should send correct payload to update endpoint in updateDoctor", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const payload = { specialization: "Cardiology", salary: 150000, department_id: 2 };

    await updateDoctor(10, payload);
    expect(api.put).toHaveBeenCalledWith("/doctor/edit-doctor/10", payload);
  });

  it("should return detailed doctor information array from data property in getDoctorsWithDetails", async () => {
    const mockData = { data: [{ id: 1, name: "Dr. Smith", department_name: "Cardiology" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getDoctorsWithDetails();
    expect(api.get).toHaveBeenCalledWith("/doctor/get-doctors-with-details");
    expect(result).toEqual(mockData.data);
  });

  it("should send constructor fields to post endpoint in createDoctor", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    const payload = {
      user_id: 101,
      specialization: "Neurology",
      salary: 180000,
      department_id: 4,
    };

    await createDoctor(payload);
    expect(api.post).toHaveBeenCalledWith("/doctor/add-doctor", payload);
  });

  it("should call delete endpoint and return response content in removeDoctor", async () => {
    const mockResponse = { success: true, message: "Doctor removed successfully" };
    vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

    const result = await removeDoctor(5);
    expect(api.delete).toHaveBeenCalledWith("Doctor/remove-doctor/5");
    expect(result).toEqual(mockResponse);
  });
});