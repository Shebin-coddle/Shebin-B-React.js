import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import withUsersMap from "../hoc/withUsersMap";
import { getAllUsers } from "../services/UserService";
import type { User } from "../types/UserTypes";

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn(),
}));

interface TestProps {
  extraProp?: string;
}

const MockComponent: React.FC<TestProps & { userNameMap: Record<number, string> }> = ({ userNameMap, extraProp }) => {
  return (
    <div>
      <div data-testid="extra-prop">{extraProp}</div>
      <div data-testid="user-map-keys">{Object.keys(userNameMap).join(",")}</div>
      <div data-testid="user-1">{userNameMap[1]}</div>
      <div data-testid="user-2">{userNameMap[2]}</div>
    </div>
  );
};

describe("withUsersMap HOC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should configure the composite display metadata name on the wrapper component", () => {
    (MockComponent as React.ComponentType).displayName = "TestComponent";
    const WrappedComponent = withUsersMap<TestProps>(MockComponent);
    expect(WrappedComponent.displayName).toBe("withUsersMap(TestComponent)");
  });

  it("should retrieve raw service details and inject an organized mapping registry downstream", async () => {
    const mockUsers = [
      { id: 1, first_name: "John", last_name: "Doe", phone: "", email: "", password: "", role_id: 1 },
      { id: 2, first_name: "Jane", last_name: "Smith", phone: "", email: "", password: "", role_id: 1 },
    ] as User[];
    
    vi.mocked(getAllUsers).mockResolvedValueOnce(mockUsers);

    const WrappedComponent = withUsersMap<TestProps>(MockComponent);
    render(<WrappedComponent extraProp="hello-world" />);

    expect(vi.mocked(getAllUsers)).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("extra-prop")).toHaveTextContent("hello-world");

    await waitFor(() => {
      expect(screen.getByTestId("user-map-keys")).toHaveTextContent("1,2");
    });

    expect(screen.getByTestId("user-1")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("user-2")).toHaveTextContent("Jane Smith");
  });

  it("should elegantly log service failures to console channels while preventing downstream runtime breaks", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getAllUsers).mockRejectedValueOnce(new Error("Network Error"));

    const WrappedComponent = withUsersMap<TestProps>(MockComponent);
    render(<WrappedComponent />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to load users", expect.any(Error));
    });

    expect(screen.getByTestId("user-map-keys")).toHaveTextContent("");
    consoleSpy.mockRestore();
  });
});