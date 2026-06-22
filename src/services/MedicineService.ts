import type { Medicine, UpdateMedicineRequest } from "../types/MedicineTypes";
import api from "./api";

export async function getAllMedicines(): Promise<Medicine[]> {
  const response = await api.get(`/medicine/get-allmedicines`);

  return response.data.medicines || response.data.data || response.data;
}

export async function updateMedicine(
  id: number,
  medicineData: UpdateMedicineRequest,
): Promise<void> {
  await api.put(`/medicine/edit-medicine/${id}`, medicineData);
}

export async function getMedicineById(id: number): Promise<Medicine[]> {
  const response = await api.get(`/medicine/get-medicine/${id}`);

  return response.data.data || response.data;
}

export async function createMedicine(
  medicineData: UpdateMedicineRequest,
): Promise<void> {
  await api.post("/medicine/add-medicine", medicineData);
}

export const removeMedicine = async (id: number) => {
  const response = await api.delete(`/medicine/remove-medicine/${id}`);

  return response.data;
};
