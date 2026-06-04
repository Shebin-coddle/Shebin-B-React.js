import type { LoginRequest, LoginResponse } from "../types/AuthTypes";
const API_URL = import.meta.env.VITE_API_URL;


export async function LoginUser(
  loginData: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/authentication/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}
