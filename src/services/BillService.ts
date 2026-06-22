import type { Bill, UpdateBillRequest,CreateBillRequest } from "../types/BillTypes";
import api from "./api";

export async function getAllBills(): Promise<Bill[]> {
  const response = await api.get(`/bill/get-allbills`);

  return response.data.bills || response.data.data || response.data;
}

export async function updateBill(
  id: number,
  billData: UpdateBillRequest,
): Promise<void> {
  await api.put(`/bill/edit-bill/${id}`, billData);
}

export async function getBillById(id: number): Promise<Bill> {
  const response = await api.get(`/bill/get-bill/${id}`);
  return response.data.bill || response.data.data || response.data;
}



export async function createBill(billData: CreateBillRequest): Promise<void> {
  await api.post(`/bill/add-bill`, billData);
}

export const removeBill = async (id: number) => {
  const response = await api.delete(`/bill/remove-bill/${id}`);

  return response.data;
};
