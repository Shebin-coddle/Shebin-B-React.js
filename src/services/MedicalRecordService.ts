import type { MedicalRecord } from "../types/MedicalRecordTypes";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getMedicalRecordsByPatientId(
  patientId: number,
): Promise<MedicalRecord[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/medrecord/get-medrecord-by-patient/${patientId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch medical records");
  }

  return data.data;
}
