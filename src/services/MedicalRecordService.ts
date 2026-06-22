import type { MedicalRecord } from "../types/MedicalRecordTypes";
import api from "./api";
export async function getMedicalRecordsByPatientId(
  patientId: number,
): Promise<MedicalRecord[]> {
  const response = await api.get(
    `/medrecord/get-medrecord-by-patient/${patientId}`,
    
  );

  return response.data.data;
}
