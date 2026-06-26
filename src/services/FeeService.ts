import api from "./api";
import type {
  Fee,
  CreateFeeRequest,
  UpdateFeeRequest,
} from "../types/FeeTypes";

export const getAllFees = async (): Promise<Fee[]> => {
  const res = await api.get("/fee-structure/get-allfees");
  return res.data.data;
};

export const getFeeById = async (id: number): Promise<Fee> => {
  const res = await api.get(`/fee-structure/get-fee/${id}`);
  return res.data.data;
};

export const createFee = async (
  feeData: CreateFeeRequest
) => {
  await api.post("/fee-structure/add-fee", feeData);
};

export const updateFee = async (
  id: number,
  feeData: UpdateFeeRequest
) => {
  await api.put(`/fee-structure/edit-fee/${id}`, feeData);
};

export const removeFee = async (
  id: number
): Promise<void> => {
  await api.delete(`/fee-structure/remove-fee/${id}`);
};