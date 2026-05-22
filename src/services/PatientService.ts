import type { Patient, UpdatePatientRequest,PatientDetails } from "../types/PatientTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getAllPatients(): Promise<Patient[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/patient/get-allpatients`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch patients");
  }

  return data.patients || data.data || data;
}

export async function updatePatient(
  userId: number,
  patientData: UpdatePatientRequest,
): Promise<void> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/patient/edit-patient/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patientData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update patient");
  }
}

export async function getPatientDetailsById(
  id: number,
): Promise<PatientDetails> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/patient/get-patient-details/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch patient details");
  }

  return data.data;
}