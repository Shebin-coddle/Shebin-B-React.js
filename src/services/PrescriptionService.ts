import api from "./api";
import type { CreatePrescriptionRequest } from "../types/PrescriptionTypes";

export async function getPrescriptionView(
  patientId: number,
  doctorId: number,
) {
  const res = await api.get(
    `/prescription/get-prescription-view/${patientId}/${doctorId}`,
  );

  return res.data.data;
}


export async function createFullPrescription(
  data: CreatePrescriptionRequest,
): Promise<void> {
  await api.post(
    "/prescription/create-full-prescription",
    data,
  )
}