export type MedicalRecord = {
  id: number;
  patient_id: number;
  doctor_id: number;
  medical_condition: string;
  treatment: string;
  status:string,
  diagnosis_date: string;
};