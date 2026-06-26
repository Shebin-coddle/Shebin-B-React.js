import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllPatients,
  updatePatient,
  getPatientDetailsById,
  removePatient,
} = await vi.importActual<typeof import("../services/PatientService")>("../services/PatientService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("PatientService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return patients from patients field in getAllPatients", async () => {
    const mockData = { patients: [{ id: 1, name: "John Doe" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllPatients();
    expect(api.get).toHaveBeenCalledWith("/patient/get-allpatients");
    expect(result).toEqual(mockData.patients);
  });

  it("should return patients from data field in getAllPatients if patients field missing", async () => {
    const mockData = { data: [{ id: 2, name: "Jane Doe" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllPatients();
    expect(result).toEqual(mockData.data);
  });

  it("should return response data directly in getAllPatients if both structural fields missing", async () => {
    const mockData = [{ id: 3, name: "Alice Smith" }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllPatients();
    expect(result).toEqual(mockData);
  });

  it("should put update payload to edit endpoint in updatePatient", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const payload = { address: "123 Main St", phone: "555-0199" };

    await updatePatient(44, payload as any);
    expect(api.put).toHaveBeenCalledWith("/patient/edit-patient/44", payload);
  });

  it("should return patient profile from data field in getPatientDetailsById", async () => {
    const mockData = { data: { id: 10, medical_history: "None" } };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getPatientDetailsById(10);
    expect(api.get).toHaveBeenCalledWith("/patient/get-patient-details/10");
    expect(result).toEqual(mockData.data);
  });

  it("should call delete endpoint and return response in removePatient", async () => {
    const mockResponse = { success: true };
    vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

    const result = await removePatient(15);
    expect(api.delete).toHaveBeenCalledWith("/patient/remove-patient/15");
    expect(result).toEqual(mockResponse);
  });
});