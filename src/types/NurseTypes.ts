export type Nurse = {
  user_id: number;
  salary: number;
  department_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type UpdateNurseRequest = {
  salary: number;
  department_id: number;
};