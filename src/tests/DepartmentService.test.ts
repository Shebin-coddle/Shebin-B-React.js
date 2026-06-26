import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllDepartments,
  updateDepartment,
  getDepartmentById,
  createDepartment,
  removeDepartment,
} = await vi.importActual<typeof import("../services/DepartmentService")>("../services/DepartmentService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("DepartmentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return departments from departments field in getAllDepartments", async () => {
    const mockData = { departments: [{ id: 1, department_name: "ICU" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllDepartments();
    expect(api.get).toHaveBeenCalledWith("/department/get-alldepartmentS");
    expect(result).toEqual(mockData.departments);
  });

  it("should return departments from data field in getAllDepartments if departments field missing", async () => {
    const mockData = { data: [{ id: 2, department_name: "ER" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllDepartments();
    expect(result).toEqual(mockData.data);
  });

  it("should return response data directly in getAllDepartments if structural targets missing", async () => {
    const mockData = [{ id: 3, department_name: "Pediatrics" }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllDepartments();
    expect(result).toEqual(mockData);
  });

  it("should put update payload to edit endpoint in updateDepartment", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const payload = { department_name: "Cardiology Updated", contact_number: "1234567890" };

    await updateDepartment(5, payload);
    expect(api.put).toHaveBeenCalledWith("/department/edit-department/5", payload);
  });

  it("should return first array element from nested data field in getDepartmentById", async () => {
    const mockData = { data: [{ id: 8, department_name: "Neurology" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getDepartmentById(8);
    expect(api.get).toHaveBeenCalledWith("/department/get-department/8");
    expect(result).toEqual(mockData.data[0]);
  });

  it("should return data object directly in getDepartmentById if data is not an array", async () => {
    const mockData = { data: { id: 9, department_name: "Orthopedics" } };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getDepartmentById(9);
    expect(result).toEqual(mockData.data);
  });

  it("should return raw data fallback in getDepartmentById if data fields are missing", async () => {
    const mockData = { id: 10, department_name: "Dermatology" };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getDepartmentById(10);
    expect(result).toEqual(mockData);
  });

  it("should send fields to creation endpoint in createDepartment", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    const payload = { department_name: "Oncology", contact_number: "0987654321" };

    await createDepartment(payload);
    expect(api.post).toHaveBeenCalledWith("/department/add-department", payload);
  });

  it("should trigger delete route and return output data in removeDepartment", async () => {
    const mockResponse = { success: true };
    vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

    const result = await removeDepartment(12);
    expect(api.delete).toHaveBeenCalledWith("/department/remove-department/12");
    expect(result).toEqual(mockResponse);
  });
});