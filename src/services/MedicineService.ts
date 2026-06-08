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


export async function getMedicineById(
  id: number,
): Promise<Medicine[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/medicine/get-medicine/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Medicine not found");
  }
  return data.data || data;
}



export async function createMedicine(
  medicineData: UpdateMedicineRequest,
): Promise<void> {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/medicine/add-medicine`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(medicineData),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create medicine");
  }
}


export const removeMedicine = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:3000/medicine/remove-medicine/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete medicine");
  }
  return data;
};