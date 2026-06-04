import { loginUser } from "../services/authService";
import { vi } from "vitest";

beforeEach(() => {
  vi.restoreAllMocks();
});

test("loginUser returns data when login is successful", async () => {
  const mockResponse = {
    success: true,
    message: "Login successful",
    token: "test-token",
    user: {
      id: 1,
      email: "admin@gmail.com",
      role_id: 1,
    },
  };

  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }),
  );

  const result = await loginUser({
    email: "admin@gmail.com",
    password: "123456",
  });

  expect(result.token).toBe("test-token");
  expect(result.user?.role_id).toBe(1);
});

test("loginUser throws error when login fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: "Invalid email or password",
      }),
    }),
  );

  await expect(
    loginUser({
      email: "wrong@gmail.com",
      password: "wrong",
    }),
  ).rejects.toThrow("Invalid email or password");
});

test("loginUser throws default error when response has no message", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
      }),
    }),
  );

  await expect(
    loginUser({
      email: "wrong@gmail.com",
      password: "wrong",
    }),
  ).rejects.toThrow("Login failed");
});
