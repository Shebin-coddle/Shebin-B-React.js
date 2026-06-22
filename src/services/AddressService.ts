import api from "./api";
import type { CreateAddressRequest, Address } from "../types/AddressTypes";

export async function createAddress(
  addressData: CreateAddressRequest,
): Promise<Address> {
  const response = await api.post<Address>(`/address/add-address`, addressData);

  return response.data;
}

export async function getAddressById(id: number): Promise<Address> {
  const response = await api.get(`/address/get-address/${id}`);

  return response.data.address || response.data.data || response.data;
}

export async function updateAddress(
  id: number,
  addressData: CreateAddressRequest,
): Promise<void> {
  await api.put(`/address/edit-address/${id}`, addressData);
}
