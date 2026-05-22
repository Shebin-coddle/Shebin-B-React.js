export type User = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  role_id: number;
};

export type UpdateUserRequest = {
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  role_id: number;
};