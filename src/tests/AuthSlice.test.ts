import { describe, it, expect, beforeEach, vi } from "vitest";
import authReducer, { login, logout } from "../redux/authSlice";

describe("authSlice reducer", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return the default initial state when localStorage is empty", () => {
    const state = authReducer(undefined, { type: "@@INIT" });

    expect(state).toEqual({
      token: null,
      roleId: null,
      userId: null,
      isAthenticated: false,
    });
  });

  it("should populate the initial state from localStorage if values exist", () => {
    localStorage.setItem("token", "mock-token-123");
    localStorage.setItem("role_id", "admin-role");
    localStorage.setItem("User_id", "user-456");

    const initialState = {
      token: localStorage.getItem("token"),
      roleId: localStorage.getItem("role_id"),
      userId: localStorage.getItem("User_id"),
      isAthenticated: !!localStorage.getItem("token"),
    };

    const state = authReducer(initialState, { type: "@@INIT" });

    expect(state.token).toBe("mock-token-123");
    expect(state.roleId).toBe("admin-role");
    expect(state.userId).toBe("user-456");
    expect(state.isAthenticated).toBe(true);
  });

  it("should handle login action and update state correctly", () => {
    const prevState = {
      token: null,
      roleId: null,
      userId: null,
      isAthenticated: false,
    };

    const loginPayload = {
      token: "new-token-xyz",
      userId: "user-789",
      role_id: "doctor-role",
    };

    const nextState = authReducer(prevState, login(loginPayload));

    expect(nextState).toEqual({
      token: "new-token-xyz",
      userId: "user-789",
      roleId: "doctor-role",
      isAthenticated: true,
    });
  });

  it("should handle logout action and clear state credentials", () => {
    const loggedInState = {
      token: "active-token",
      roleId: "nurse-role",
      userId: "user-001",
      isAthenticated: true,
    };

    const nextState = authReducer(loggedInState, logout());

    expect(nextState).toEqual({
      token: null,
      userId: null,
      roleId: null,
      isAthenticated: false,
    });
  });
});