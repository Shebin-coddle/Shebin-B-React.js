import { describe, it, expect, beforeEach, vi } from "vitest";
import api from "../services/api";

const {
  getAllBills,
  updateBill,
  getBillById,
  createBill,
  removeBill,
  payBill,
} = await vi.importActual<typeof import("../services/BillService")>("../services/BillService");

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("BillService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return bills from bills field in getAllBills", async () => {
    const mockData = { bills: [{ id: 101, amount: 500 }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllBills();
    expect(api.get).toHaveBeenCalledWith("/bill/get-allbills");
    expect(result).toEqual(mockData.bills);
  });

  it("should return bills from data field in getAllBills if bills field missing", async () => {
    const mockData = { data: [{ id: 102, amount: 750 }] };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllBills();
    expect(result).toEqual(mockData.data);
  });

  it("should return response data directly in getAllBills if both structural fields missing", async () => {
    const mockData = [{ id: 103, amount: 1200 }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getAllBills();
    expect(result).toEqual(mockData);
  });

  it("should put update payload to edit endpoint in updateBill", async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const payload = { amount: 600, status: "paid" };

    await updateBill(21, payload as any);
    expect(api.put).toHaveBeenCalledWith("/bill/edit-bill/21", payload);
  });

  it("should return bill from bill field in getBillById", async () => {
    const mockData = { bill: { id: 301, amount: 150 } };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getBillById(301);
    expect(api.get).toHaveBeenCalledWith("/bill/get-bill/301");
    expect(result).toEqual(mockData.bill);
  });

  it("should return bill from data field in getBillById if bill missing", async () => {
    const mockData = { data: { id: 302, amount: 250 } };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getBillById(302);
    expect(result).toEqual(mockData.data);
  });

  it("should return raw response data in getBillById if fallback fields are missing", async () => {
    const mockData = { id: 303, amount: 350 };
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await getBillById(303);
    expect(result).toEqual(mockData);
  });

  it("should post creation payload to add endpoint in createBill", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    const payload = { appointment_id: 5, amount: 450, tax: 50 };

    await createBill(payload as any);
    expect(api.post).toHaveBeenCalledWith("/bill/add-bill", payload);
  });

  it("should trigger deletion request and return details in removeBill", async () => {
    const mockResponse = { success: true };
    vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

    const result = await removeBill(45);
    expect(api.delete).toHaveBeenCalledWith("/bill/remove-bill/45");
    expect(result).toEqual(mockResponse);
  });

  it("should put mode of payment details to payment endpoint and return response in payBill", async () => {
    const mockResponse = { success: true, transactionId: "TXN123" };
    vi.mocked(api.put).mockResolvedValue({ data: mockResponse });

    const result = await payBill(99, "UPI");
    expect(api.put).toHaveBeenCalledWith("/bill-payment/pay-bill/99", { mode_of_payment: "UPI" });
    expect(result).toEqual(mockResponse);
  });
});