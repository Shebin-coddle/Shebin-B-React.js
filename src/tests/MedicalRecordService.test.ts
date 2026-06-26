import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getMedicalRecordsByPatientId,
} = await vi.importActual<typeof import("../services/MedicalRecordService")>("../services/MedicalRecordService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("MedicalRecordService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should request records matching specific patient identity parameters and unpack data block context", async () => {
    const mockData = { data: [{ id: 50, diagnosis: "Healthy" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getMedicalRecordsByPatientId(99);
    expect(api.get).toHaveBeenCalledWith("/medrecord/get-medrecord-by-patient/99");
    expect(result).toEqual(mockData.data);
  });
});