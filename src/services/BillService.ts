import type {
  Bill,
  UpdateBillRequest,
} from "../types/BillTypes";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export async function getAllBills(): Promise<Bill[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/bill/get-allbills`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch bills",
    );
  }

  return data.bills || data.data || data;
}

export async function updateBill(
  id: number,
  billData: UpdateBillRequest,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/bill/edit-bill/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(billData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update bill",
    );
  }
}

export async function getBillById(id: number): Promise<Bill> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/bill/get-bill/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch bill");
  }

  return data.bill || data.data || data;
}

export async function createBill(
  billData: UpdateBillRequest,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/bill/add-bill`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(billData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create bill");
  }
}

export const removeBill = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/bill/remove-bill/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete bill");
  }

  return data;
};