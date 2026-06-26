import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllMedicines,
  updateMedicine,
  getMedicineById,
  createMedicine,
  removeMedicine,
} = await vi.importActual<typeof import("../services/MedicineService")>("../services/MedicineService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("MedicineService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return medicines from medicines field in getAllMedicines", async () => {
    const mockData = { medicines: [{ id: 1, name: "Paracetamol" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllMedicines();
    expect(api.get).toHaveBeenCalledWith("/medicine/get-allmedicines");
    expect(result).toEqual(mockData.medicines);
  });

  it("should return medicines from data field in getAllMedicines if field missing", async () => {
    const mockData = { data: [{ id: 2, name: "Ibuprofen" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllMedicines();
    expect(result).toEqual(mockData.data);
  });

  it("should return raw response data in getAllMedicines if falls back entirely", async () => {
    const mockData = [{ id: 3, name: "Amoxicillin" }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllMedicines();
    expect(result).toEqual(mockData);
  });

  it("should target put details into editing context in updateMedicine", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const payload = { price: 15 };

    await updateMedicine(10, payload as any);
    expect(api.put).toHaveBeenCalledWith("/medicine/edit-medicine/10", payload);
  });

  it("should return array field content matching data block key in getMedicineById", async () => {
    const mockData = { data: [{ id: 5, name: "Aspirin" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getMedicineById(5);
    expect(api.get).toHaveBeenCalledWith("/medicine/get-medicine/5");
    expect(result).toEqual(mockData.data);
  });

  it("should return full context root fallback directly in getMedicineById if key missing", async () => {
    const mockData = [{ id: 6, name: "Metformin" }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getMedicineById(6);
    expect(result).toEqual(mockData);
  });

  it("should route creation profile into matching add path in createMedicine", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    const payload = { name: "Vitamin C", price: 10 };

    await createMedicine(payload as any);
    expect(api.post).toHaveBeenCalledWith("/medicine/add-medicine", payload);
  });

  it("should clear medicine element via delete route in removeMedicine", async () => {
    const mockResponse = { success: true };
    vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

    const result = await removeMedicine(40);
    expect(api.delete).toHaveBeenCalledWith("/medicine/remove-medicine/40");
    expect(result).toEqual(mockResponse);
  });
});