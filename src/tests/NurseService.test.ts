import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllNurses,
  updateNurse,
  getNurseById,
  removeNurse,
} = await vi.importActual<typeof import("../services/NurseService")>("../services/NurseService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("NurseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return nurses from nurses field in getAllNurses", async () => {
    const mockData = { nurses: [{ id: 1, name: "Nurse Joy" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllNurses();
    expect(api.get).toHaveBeenCalledWith("/nurse/get-allnurses");
    expect(result).toEqual(mockData.nurses);
  });

  it("should return nurses from data field in getAllNurses if nurses missing", async () => {
    const mockData = { data: [{ id: 2, name: "Nurse Clara" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllNurses();
    expect(result).toEqual(mockData.data);
  });

  it("should return response data directly in getAllNurses if structural properties missing", async () => {
    const mockData = [{ id: 3, name: "Nurse Florence" }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllNurses();
    expect(result).toEqual(mockData);
  });

  it("should send fields to update endpoint in updateNurse", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const payload = { salary: 4500, department_id: 3 };

    await updateNurse(14, payload as any);
    expect(api.put).toHaveBeenCalledWith("/nurse/edit-nurse/14", payload);
  });

  it("should pull the first item from data collection array in getNurseById", async () => {
    const mockData = { data: [{ id: 8, name: "Nurse Joy" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getNurseById(8);
    expect(api.get).toHaveBeenCalledWith("/nurse/get-nurse/8");
    expect(result).toEqual(mockData.data[0]);
  });

  it("should request profile elimination via delete endpoint and return response in removeNurse", async () => {
    const mockResponse = { success: true };
    vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

    const result = await removeNurse(22);
    expect(api.delete).toHaveBeenCalledWith("/nurse/remove-nurse/22");
    expect(result).toEqual(mockResponse);
  });
});