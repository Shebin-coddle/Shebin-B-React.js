import type { Nurse, UpdateNurseRequest } from "../types/NurseTypes";
import api from "./api";

export async function getAllNurses(): Promise<Nurse[]> {
  const response = await api.get(`/nurse/get-allnurses`);
  return response.data.nurses || response.data.data || response.data;
}

export async function updateNurse(
  userId: number,
  nurseData: UpdateNurseRequest,
): Promise<void> {
  await api.put(`/nurse/edit-nurse/${userId}`, nurseData);
}

export async function getNurseById(id: number): Promise<Nurse> {
  const response = await api.get(`/nurse/get-nurse/${id}`);

  return response.data.data[0];
}

export const removeNurse = async (id: number) => {
  const response = await api.delete(`/nurse/remove-nurse/${id}`);

  return response.data;
};
