import { describe, it, expect, beforeEach, vi } from "vitest";
import { LoginUser } from "../services/AuthService";
import type { LoginRequest } from "../types/AuthTypes";

describe("AuthService - LoginUser", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("should return data when the login response is successful", async () => {
    const mockResponseData = {
      token: "mock-jwt-token",
      userId: "user-123",
      role_id: "1",
      message: "Login successful",
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponseData,
    });

    const loginData: LoginRequest = {
      email: "testuser@gmail.com",
      password: "password123",
    };

    const result = await LoginUser(loginData);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponseData);
  });

  it("should throw an error with the backend message when the response is not ok", async () => {
    const mockErrorData = {
      message: "Invalid credentials",
    };

    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => mockErrorData,
    });

    const loginData: LoginRequest = {
      email: "wronguser@gmail.com",
      password: "wrongpassword",
    };

    await expect(LoginUser(loginData)).rejects.toThrow("Invalid credentials");
  });

  it("should throw a default fallback error message when the response is not ok and message is empty", async () => {
    const mockErrorData = {};

    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => mockErrorData,
    });

    const loginData: LoginRequest = {
      email: "wronguser@gmail.com",
      password: "wrongpassword",
    };

    await expect(LoginUser(loginData)).rejects.toThrow("Login failed");
  });
});