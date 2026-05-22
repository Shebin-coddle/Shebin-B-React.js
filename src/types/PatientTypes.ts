export type Patient = {
  user_id: number;
  dob: string;
  blood_group: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type UpdatePatientRequest = {
  dob: string;
  blood_group: string | null;
};

export type PatientDetails = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  dob: string;
  blood_group: string | null;
};