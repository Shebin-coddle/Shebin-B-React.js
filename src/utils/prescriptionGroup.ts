import type {
  PrescriptionView,
  PrescriptionJoinRow,
} from "../types/PrescriptionTypes";

export function groupPrescriptions(
  rows: PrescriptionJoinRow[],
): PrescriptionView[] {
  const map: Record<number, PrescriptionView> = {};

  for (const row of rows) {
    const prescriptionId = row.prescription_id;

    if (!map[prescriptionId]) {
      map[prescriptionId] = {
        id: prescriptionId,
        patient_id: row.patient_id,
        doctor_id: row.doctor_id,
        items: [],
      };
    }

    if (row.item_id != null && row.medicine_id != null) {
      map[prescriptionId].items.push({
        id: row.item_id,
        medicine_id: row.medicine_id,
        dosage: row.dosage ?? "",
        start_date: row.start_date ?? "",
        end_date: row.end_date ?? "",
      });
    }
  }

  return Object.values(map);
}