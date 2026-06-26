import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import api from "../services/api";
import { store } from "../redux/store";

vi.mock("../redux/store", () => ({
  store: {
    dispatch: vi.fn(),
  },
}));

describe("API Service Interceptors", () => {
  const originalLocation = globalThis.location;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.restoreAllMocks();

    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: { href: "" },
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("should append Authorization header with Bearer token if token exists in localStorage", async () => {
    localStorage.setItem("token", "test-auth-token");
    const config = { headers: {} };

    const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const modifiedConfig = await requestInterceptor(config);

    expect(modifiedConfig.headers.Authorization).toBe("Bearer test-auth-token");
  });

  it("should not append Authorization header if token does not exist in localStorage", async () => {
    const config = { headers: {} };

    const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const modifiedConfig = await requestInterceptor(config);

    expect(modifiedConfig.headers.Authorization).toBeUndefined();
  });

  it("should reject request error in request interceptor", async () => {
    const errorInterceptor = (api.interceptors.request as any).handlers[0].rejected;
    const mockError = new Error("Request configuration failed");

    await expect(errorInterceptor(mockError)).rejects.toThrow(
      "Request configuration failed",
    );
  });

  it("should pass through valid responses", () => {
    const mockResponse = { data: { success: true }, status: 200 };
    const responseInterceptor = (api.interceptors.response as any).handlers[0].fulfilled;

    const result = responseInterceptor(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it("should handle 401 response error, clear storage, dispatch logout, and redirect", async () => {
    localStorage.setItem("token", "expired-token");

    const errorInterceptor = (api.interceptors.response as any).handlers[0].rejected;
    const mockError = {
      response: { status: 401 },
    };

    await expect(errorInterceptor(mockError)).rejects.toEqual(mockError);

    expect(localStorage.getItem("token")).toBeNull();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(globalThis.location.href).toBe("/login");
  });

  it("should reject other non-401 response errors without structural side effects", async () => {
    localStorage.setItem("token", "valid-token");

    const errorInterceptor = (api.interceptors.response as any).handlers[0].rejected;
    const mockError = {
      response: { status: 500 },
    };

    await expect(errorInterceptor(mockError)).rejects.toEqual(mockError);

    expect(localStorage.getItem("token")).toBe("valid-token");
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(globalThis.location.href).not.toBe("/login");
  });
});