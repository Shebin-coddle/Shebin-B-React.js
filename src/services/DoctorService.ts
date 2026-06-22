import api from "./api";
import type {
  Doctor,
  UpdateDoctorRequest,
  DoctorDetails,
} from "../types/DoctorTypes";

export async function getAllDoctors(): Promise<Doctor[]> {
  const response = await api.get("/doctor/get-alldoctors");

  return response.data.data;
}

export async function updateDoctor(
  userId: number,
  doctorData: UpdateDoctorRequest,
): Promise<void> {
  await api.put(`/doctor/edit-doctor/${userId}`, doctorData);
}

export async function getDoctorsWithDetails(): Promise<DoctorDetails[]> {
  const response = await api.get(`/doctor/get-doctors-with-details`);

  return response.data.data;
}

export async function createDoctor(doctorData: {
  user_id: number;
  specialization: string;
  salary: number;
  department_id: number;
}): Promise<void> {
  await api.post(`/doctor/add-doctor`, doctorData);
}

export const removeDoctor = async (id: number) => {
  const response = await api.delete(`Doctor/remove-doctor/${id}`);

  return response.data;
};
