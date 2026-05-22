import type { Medicine, UpdateMedicineRequest } from "../types/MedicineTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllMedicines(): Promise<Medicine[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/medicine/get-allmedicines`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch medicines");
  }

  return data.medicines || data.data || data;
}

export async function updateMedicine(
  id: number,
  medicineData: UpdateMedicineRequest,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/medicine/edit-medicine/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(medicineData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update medicine");
  }
}
