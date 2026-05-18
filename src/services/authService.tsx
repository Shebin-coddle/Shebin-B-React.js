import type { LoginRequest, LoginResponse } from "../types/authTypes";

const API_url = "http://localhost:3000/authentication";

export async function loginUser(
  loginData: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch(`${API_url}/login`, {
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
