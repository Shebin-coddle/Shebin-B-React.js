import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getPrescriptionView,
  createFullPrescription,
} = await vi.importActual<typeof import("../services/PrescriptionService")>("../services/PrescriptionService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("PrescriptionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve prescription view records using patient and doctor identities", async () => {
    const mockData = { data: [{ id: 1, medicine_name: "Amoxicillin" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getPrescriptionView(10, 20);
    expect(api.get).toHaveBeenCalledWith("/prescription/get-prescription-view/10/20");
    expect(result).toEqual(mockData.data);
  });

  it("should post a full prescription layout payload to the collection endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    const payload = {
      appointment_id: 101,
      medicines: [{ medicine_id: 5, dosage: "1-0-1" }],
    };

    await createFullPrescription(payload as any);
    expect(api.post).toHaveBeenCalledWith("/prescription/create-full-prescription", payload);
  });
});