export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    role_id: number;
  };
};