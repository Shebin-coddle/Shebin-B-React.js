export type Department = {
  id: number;
  department_name: string;
  contact_number: string | null;
  created_at: string;
};

export type UpdateDepartmentRequest = {
  department_name: string;
  contact_number: string | null;
};