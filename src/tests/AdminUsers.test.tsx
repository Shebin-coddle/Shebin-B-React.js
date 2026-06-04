import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import AdminUsers from "./../pages/admin/AdminUsers";

import * as UserService from "../services/UserService";
import type { User } from "../types/UserTypes";

beforeEach(() => {
  vi.clearAllMocks();
});

const mockUsers: User[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@test.com",
    phone: "1234567890",
    role_id: 2,
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@test.com",
    phone: "9999999999",
    role_id: 3,
  },
];

describe("AdminUsers", () => {
  test("renders users list", async () => {
    vi.spyOn(UserService, "getAllUsers").mockResolvedValue(mockUsers);

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    vi.spyOn(UserService, "getAllUsers").mockImplementation(
      () => new Promise(() => {})
    );

    render(<AdminUsers />);

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  test("handles error state", async () => {
    vi.spyOn(UserService, "getAllUsers").mockRejectedValue(
      new Error("Failed to load users")
    );

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load users")).toBeInTheDocument();
    });
  });

  test("filters users by search", async () => {
    vi.spyOn(UserService, "getAllUsers").mockResolvedValue(mockUsers);

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search users by name or email"
    );

    fireEvent.change(searchInput, { target: { value: "Jane" } });

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  test("opens view user details (no duplicate text issue)", async () => {
    vi.spyOn(UserService, "getAllUsers").mockResolvedValue(mockUsers);

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getAllByText("View")[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("View")[0]);

    expect(screen.getByText("Selected User Details")).toBeInTheDocument();

    // FIX: scope inside modal/card
    const detailCard = screen.getByText("Selected User Details").closest("div")!;
    expect(within(detailCard).getByText("John Doe")).toBeInTheDocument();
    expect(within(detailCard).getByText("john@test.com")).toBeInTheDocument();
  });

  test("opens edit form", async () => {
    vi.spyOn(UserService, "getAllUsers").mockResolvedValue(mockUsers);

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getAllByText("Edit")[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(screen.getByText("Edit User")).toBeInTheDocument();
  });

  test("updates user (submit form)", async () => {
    vi.spyOn(UserService, "getAllUsers").mockResolvedValue(mockUsers);

    const updateSpy = vi.spyOn(UserService, "updateUser").mockResolvedValue({
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
      phone: "1234567890",
      role_id: 2,
    });

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getAllByText("Edit")[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    const form = document.querySelector(".edit-user-form") as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  test("deletes user", async () => {
    vi.spyOn(UserService, "getAllUsers").mockResolvedValue(mockUsers);

    const removeSpy = vi
      .spyOn(UserService, "removeUser")
      .mockResolvedValue(undefined);

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<AdminUsers />);

    await waitFor(() => {
      expect(screen.getAllByText("Delete")[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(removeSpy).toHaveBeenCalledWith(1);
  });
});