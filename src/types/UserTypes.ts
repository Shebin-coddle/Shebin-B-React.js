export type User = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  password: string;
  role_id: number;
};

export type UpdateUserRequest = {
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  role_id: number;
};
export type CreateUserRequest = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  role_id: number;
};

export type CompleteUserForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role_id: number;

  street_name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;

  specialization?: string;
  salary?: number;
  department_id?: number;

  dob?: string;
  blood_group?: string;
};