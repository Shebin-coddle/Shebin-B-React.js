import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../services/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}));

import api from "../services/api";
import {
  createAddress,
  getAddressById,
  updateAddress,
} from "../services/AddressService";

describe("AddressService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create address", async () => {
    const mockData = { id: 1, street: "Anna Nagar" };

    (api.post as any).mockResolvedValue({ data: mockData });

    const payload = { street: "Anna Nagar" };

    const result = await createAddress(payload as any);

    expect(api.post).toHaveBeenCalledWith(
      "/address/add-address",
      payload,
    );

    expect(result).toEqual(mockData);
  });

  it("should get address by id (address field)", async () => {
    const mockData = { id: 1, street: "Main Road" };

    (api.get as any).mockResolvedValue({
      data: { address: mockData },
    });

    const result = await getAddressById(1);

    expect(result).toEqual(mockData);
  });

  it("should get address by id (data fallback)", async () => {
    const mockData = { id: 2, street: "Second Road" };

    (api.get as any).mockResolvedValue({
      data: { data: mockData },
    });

    const result = await getAddressById(2);

    expect(result).toEqual(mockData);
  });

  it("should update address", async () => {
    (api.put as any).mockResolvedValue({});

    const payload = { street: "Updated Street" };

    await updateAddress(5, payload as any);

    expect(api.put).toHaveBeenCalledWith(
      "/address/edit-address/5",
      payload,
    );
  });
});