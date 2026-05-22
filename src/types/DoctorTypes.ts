export type Doctor = {
  user_id: number;
  specialization: string;
  salary: number;
  department_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type UpdateDoctorRequest = {
  specialization: string;
  salary: number;
  department_id: number;
};
export type DoctorDetails = {
  user_id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  department_id: number;
};