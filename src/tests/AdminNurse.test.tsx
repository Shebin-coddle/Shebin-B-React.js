import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import AdminNurses from "../pages/admin/AdminNurse";

import {
  mockGetAllNurses,
  mockUpdateNurse,
} from "./mocks/ServicesMock";

describe("AdminNurses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const nurseData = [
    {
      user_id: 1,
      salary: 25000,
      department_id: 2,
    },
  ];

  it("renders nurses table", async () => {
    mockGetAllNurses.mockResolvedValue(nurseData);

    render(<AdminNurses />);

    expect(await screen.findByText("Nurses")).toBeInTheDocument();
    expect(screen.getByText("25000")).toBeInTheDocument();
  });

  it("handles fetch error", async () => {
    mockGetAllNurses.mockRejectedValue(new Error("Fetch failed"));

    render(<AdminNurses />);

    expect(await screen.findByText("Fetch failed")).toBeInTheDocument();
  });

  it("opens details modal when View clicked", async () => {
    mockGetAllNurses.mockResolvedValue(nurseData);

    render(<AdminNurses />);

    fireEvent.click(await screen.findByRole("button", { name: /view/i }));

    expect(
      screen.getByText("Selected Nurse Details")
    ).toBeInTheDocument();
  });

  it("opens edit form when Edit clicked", async () => {
    mockGetAllNurses.mockResolvedValue(nurseData);

    render(<AdminNurses />);

    fireEvent.click(await screen.findByRole("button", { name: /edit/i }));

    expect(screen.getByText("Edit Nurse")).toBeInTheDocument();
  });

  it("updates nurse successfully", async () => {
    mockGetAllNurses.mockResolvedValue(nurseData);
    mockUpdateNurse.mockResolvedValue(undefined);

    render(<AdminNurses />);

    fireEvent.click(await screen.findByRole("button", { name: /edit/i }));

    const salaryInput = screen.getByDisplayValue("25000");

    fireEvent.change(salaryInput, {
      target: { value: "30000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(mockUpdateNurse).toHaveBeenCalledWith(1, {
        salary: 30000,
        department_id: 2,
      });
    });
  });

  it("handles update error", async () => {
    mockGetAllNurses.mockResolvedValue(nurseData);
    mockUpdateNurse.mockRejectedValue(new Error("Update failed"));

    render(<AdminNurses />);

    fireEvent.click(await screen.findByRole("button", { name: /edit/i }));

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    expect(await screen.findByText("Update failed")).toBeInTheDocument();
  });

  it("closes edit form when cancel clicked", async () => {
    mockGetAllNurses.mockResolvedValue(nurseData);

    render(<AdminNurses />);

    fireEvent.click(await screen.findByRole("button", { name: /edit/i }));

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByText("Edit Nurse")).not.toBeInTheDocument();
    });
  });
});