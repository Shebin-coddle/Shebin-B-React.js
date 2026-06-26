import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllUsers,
  removeUser,
  updateUser,
  createCompleteUser,
  getUserById,
  getCompleteUser,
  updateCompleteUser,
} = await vi.importActual<typeof import("../services/UserService")>("../services/UserService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return users from users field in getAllUsers", async () => {
    const mockData = { users: [{ id: 1, email: "u1@test.com" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllUsers();
    expect(api.get).toHaveBeenCalledWith("/users/get-allusers");
    expect(result).toEqual(mockData.users);
  });

  it("should return users from data field in getAllUsers if users field missing", async () => {
    const mockData = { data: [{ id: 2, email: "u2@test.com" }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllUsers();
    expect(result).toEqual(mockData.data);
  });

  it("should return response data directly in getAllUsers if both target fields are missing", async () => {
    const mockData = [{ id: 3, email: "u3@test.com" }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllUsers();
    expect(result).toEqual(mockData);
  });

  it("should send delete request and return response in removeUser", async () => {
    const mockResponse = { success: true };
    vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

    const result = await removeUser(8);
    expect(api.delete).toHaveBeenCalledWith("/users/remove-user/8");
    expect(result).toEqual(mockResponse);
  });

  it("should return user from user field in updateUser", async () => {
    const mockData = { user: { id: 10, first_name: "Updated" } };
    vi.mocked(api.put).mockResolvedValue({ data: mockData });
    const payload = { first_name: "Updated" };

    const result = await updateUser(10, payload as any);
    expect(api.put).toHaveBeenCalledWith("/users/edit-user/10", payload);
    expect(result).toEqual(mockData.user);
  });

  it("should return user from data field in updateUser if user field missing", async () => {
    const mockData = { data: { id: 11, first_name: "UpdatedData" } };
    vi.mocked(api.put).mockResolvedValue({ data: mockData });

    const result = await updateUser(11, {} as any);
    expect(result).toEqual(mockData.data);
  });

  it("should return raw data back from updateUser if fallback pathways are missing", async () => {
    const mockData = { id: 12, first_name: "RawData" };
    vi.mocked(api.put).mockResolvedValue({ data: mockData });

    const result = await updateUser(12, {} as any);
    expect(result).toEqual(mockData);
  });

  it("should build doctor specific data format when role_id is 2 in createCompleteUser", async () => {
    const mockResult = { id: 100, success: true };
    vi.mocked(api.post).mockResolvedValue({ data: mockResult });

    const formData = {
      first_name: "John",
      last_name: "Doe",
      email: "john@doc.com",
      phone: "123",
      password: "pwd",
      role_id: 2,
      street_name: "Main St",
      city: "City",
      district: "Dist",
      state: "State",
      pincode: "111",
      specialization: "Cardio",
      salary: 5000,
      department_id: 1,
    };

    const result = await createCompleteUser(formData as any);
    expect(api.post).toHaveBeenCalledWith("/users/add-complete-user", {
      first_name: "John",
      last_name: "Doe",
      email: "john@doc.com",
      phone: "123",
      password: "pwd",
      role_id: 2,
      address: { street_name: "Main St", city: "City", district: "Dist", state: "State", pincode: "111" },
      doctor: { specialization: "Cardio", salary: 5000, department_id: 1 },
      patient: undefined,
      nurse: undefined,
    });
    expect(result).toEqual(mockResult);
  });

  it("should build patient specific data format when role_id is 3 in createCompleteUser", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });

    const formData = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@pat.com",
      phone: "456",
      password: "pwd",
      role_id: 3,
      street_name: "Sub St",
      city: "Town",
      district: "Dist",
      state: "State",
      pincode: "222",
      dob: "2000-01-01",
      blood_group: "O+",
    };

    await createCompleteUser(formData as any);
    expect(api.post).toHaveBeenCalledWith("/users/add-complete-user", {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@pat.com",
      phone: "456",
      password: "pwd",
      role_id: 3,
      address: { street_name: "Sub St", city: "Town", district: "Dist", state: "State", pincode: "222" },
      doctor: undefined,
      patient: { dob: "2000-01-01", blood_group: "O+" },
      nurse: undefined,
    });
  });

  it("should build nurse specific data format when role_id is 4 in createCompleteUser", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });

    const formData = {
      first_name: "Mary",
      last_name: "Jane",
      email: "mary@nurse.com",
      phone: "789",
      password: "pwd",
      role_id: 4,
      street_name: "Cross St",
      city: "Village",
      district: "Dist",
      state: "State",
      pincode: "333",
      salary: 3000,
      department_id: 2,
    };

    await createCompleteUser(formData as any);
    expect(api.post).toHaveBeenCalledWith("/users/add-complete-user", {
      first_name: "Mary",
      last_name: "Jane",
      email: "mary@nurse.com",
      phone: "789",
      password: "pwd",
      role_id: 4,
      address: { street_name: "Cross St", city: "Village", district: "Dist", state: "State", pincode: "333" },
      doctor: undefined,
      patient: undefined,
      nurse: { salary: 3000, department_id: 2 },
    });
  });

  it("should pull base data object directly in getUserById", async () => {
    const mockData = { id: 70, name: "Base User" };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getUserById(70);
    expect(api.get).toHaveBeenCalledWith("/users/70");
    expect(result).toEqual(mockData);
  });

  it("should pull base data object directly in getCompleteUser", async () => {
    const mockData = { id: 80, name: "Complete Profile" };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getCompleteUser(80);
    expect(api.get).toHaveBeenCalledWith("/users/complete-details/80");
    expect(result).toEqual(mockData);
  });

  it("should put update details and return dynamic response object in updateCompleteUser", async () => {
    const mockResult = { success: true };
    vi.mocked(api.put).mockResolvedValue({ data: mockResult });
    const payload = { first_name: "Changed" };

    const result = await updateCompleteUser(90, payload as any);
    expect(api.put).toHaveBeenCalledWith("/users/edit-complete-user/90", payload);
    expect(result).toEqual(mockResult);
  });
});