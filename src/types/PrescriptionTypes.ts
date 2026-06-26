export type PrescriptionJoinRow = {
  prescription_id: number;
  patient_id: number;
  doctor_id: number;
  item_id: number | null;
  medicine_id: number | null;
  dosage: string | null;
  start_date: string | null;
  end_date: string | null;
};

export type PrescriptionItem = {
  id: number;
  medicine_id: number;
  dosage: string;
  start_date: string;
  end_date: string;
};

export type PrescriptionView = {
  id: number;
  patient_id: number;
  doctor_id: number;
  items: PrescriptionItem[];
};


export type CreatePrescriptionItem = {
  medicine_id: number;
  dosage: string;
  start_date: string;
  end_date: string;
};

export type CreatePrescriptionRequest = {
  patient_id: number;
  doctor_id: number;
  items: CreatePrescriptionItem[];
};