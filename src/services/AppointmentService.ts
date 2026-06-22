import type {
  Appointment,
  UpdateAppointmentRequest,
  CreateAppointmentRequest,
} from "../types/AppointmentTypes";
import api from "./api";

export async function getAllAppointments(): Promise<Appointment[]> {
  const response = await api.get(`/appointment/get-allappointments`);
  return response.data.appointments || response.data.data || response.data;
}

export async function updateAppointment(
  id: number,
  appointmentData: UpdateAppointmentRequest,
): Promise<void> {
  await api.put(`/appointment/edit-appointment/${id}`, appointmentData);
}

export async function cancelAppointment(id: number): Promise<void> {
  await api.put(`/appointment/edit-appointment/${id}`);
}

export async function approveAppointment(id: number): Promise<void> {
  await api.put(`/appointment/edit-appointment/${id}`);
}

export async function completeAppointment(id: number): Promise<void> {
  await api.put(`/appointment/edit-appointment/${id}`);
}

export async function createAppointment(
  appointmentData: CreateAppointmentRequest,
): Promise<void> {
  await api.post(`/appointment/add-appointment`, appointmentData);
}

export async function getAppointmentById(id: number) {
  const response = await api.get(`/appointment/get-appointment/${id}`);

  return response.data.appointment || response.data.data || response.data;
}

export const removeAppointment = async (id: number) => {

  const response = await api.delete(
    `/Appointment/remove-appointment/${id}`,
  );

  return response.data;
};
