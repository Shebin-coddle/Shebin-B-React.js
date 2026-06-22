import type {
  Patient,
  UpdatePatientRequest,
  PatientDetails,
} from "../types/PatientTypes";

import api from "./api";

export async function getAllPatients(): Promise<Patient[]> {
  const response = await api.get(`/patient/get-allpatients`);
  return response.data.patients || response.data.data || response.data;
}

export async function updatePatient(
  userId: number,
  patientData: UpdatePatientRequest,
): Promise<void> {
  await api.put(`/patient/edit-patient/${userId}`, patientData);
}

export async function getPatientDetailsById(
  id: number,
): Promise<PatientDetails> {
  const response = await api.get(`/patient/get-patient-details/${id}`);
  return response.data.data;
}

export const removePatient = async (id: number) => {
  const response = await api.delete(`/patient/remove-patient/${id}`);

  return response.data;
};
