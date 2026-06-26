import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllFees,
  getFeeById,
  createFee,
  updateFee,
  removeFee,
} = await vi.importActual<typeof import("../services/FeeService")>("../services/FeeService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("FeeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return fee structure collection array from data field in getAllFees", async () => {
    const mockData = { data: [{ id: 1, name: "Consultation", amount: 500 }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllFees();
    expect(api.get).toHaveBeenCalledWith("/fee-structure/get-allfees");
    expect(result).toEqual(mockData.data);
  });

  it("should return a single fee structure payload from data field in getFeeById", async () => {
    const mockData = { data: { id: 5, name: "X-Ray", amount: 1200 } };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getFeeById(5);
    expect(api.get).toHaveBeenCalledWith("/fee-structure/get-fee/5");
    expect(result).toEqual(mockData.data);
  });

  it("should post creation payload to add endpoint in createFee", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    const payload = { name: "Lab Test", amount: 350 };

    await createFee(payload as any);
    expect(api.post).toHaveBeenCalledWith("/fee-structure/add-fee", payload);
  });

  it("should put update details into correct index route endpoint in updateFee", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const payload = { amount: 400 };

    await updateFee(10, payload as any);
    expect(api.put).toHaveBeenCalledWith("/fee-structure/edit-fee/10", payload);
  });

  it("should call delete endpoint matching target index identity context in removeFee", async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: {} });

    await removeFee(25);
    expect(api.delete).toHaveBeenCalledWith("/fee-structure/remove-fee/25");
  });
});