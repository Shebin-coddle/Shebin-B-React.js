const API_BASE_URL = import.meta.env.VITE_API_URL;
import type { CreateAddressRequest,Address } from "../types/AddressTypes";


export async function createAddress(
  addressData: CreateAddressRequest,
): Promise<Address> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/address/add-address`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create address",
    );
  }

  return data.address || data.data || data;
}

export async function getAddressById(
  id: number,
): Promise<Address> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/address/get-address/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch address",
    );
  }

  return data.address || data.data || data;
}

export async function updateAddress(
  id: number,
  addressData: CreateAddressRequest,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/address/edit-address/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update address",
    );
  }
}