import { render, screen, fireEvent, waitFor,within  } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminPatients from "../pages/admin/AdminPatient";
import { getAllPatients, removePatient } from "../services/PatientService";
import { useNavigate } from "react-router-dom";
import type { Patient } from "../types/PatientTypes";

vi.mock("../services/PatientService", () => ({
  getAllPatients: vi.fn(),
  removePatient: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

const mockPatients: Patient[] = [
  {
    user_id: 1,
    dob: "1990-01-01",
    blood_group: "A+",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    deleted_at: null,
  },
  {
    user_id: 2,
    dob: "1995-05-05",
    blood_group: "B-",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    deleted_at: null,
  },
];

const mockUserNameMap = {
  1: "John Doe",
  2: "Jane Smith",
};

describe("AdminPatients", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate
    );
  });

  it("renders loading state", () => {
    (getAllPatients as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {})
    );

    render(<AdminPatients userNameMap={mockUserNameMap} />);

    expect(screen.getByText(/loading patients/i)).toBeInTheDocument();
  });

  it("renders patient table after load", async () => {
    (getAllPatients as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPatients
    );

    render(<AdminPatients userNameMap={mockUserNameMap} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("filters patients by name", async () => {
    (getAllPatients as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPatients
    );

    render(<AdminPatients userNameMap={mockUserNameMap} />);

    await screen.findByText("John Doe");

    const searchInput = screen.getByPlaceholderText(
      /search users by name/i
    );

    fireEvent.change(searchInput, { target: { value: "Jane" } });

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

 it("navigates to add page", async () => {
  (getAllPatients as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);

  render(<AdminPatients userNameMap={mockUserNameMap} />);

  await screen.findByText("Add Patient");

  fireEvent.click(screen.getByText("Add Patient"));

  expect(mockNavigate).toHaveBeenCalledWith("/admin-users/add");
});

 it("deletes a patient", async () => {
  (getAllPatients as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
    mockPatients
  );

  (removePatient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
    undefined
  );

  render(<AdminPatients userNameMap={mockUserNameMap} />);

  await screen.findByText("John Doe");

  const deleteButtons = screen.getAllByText("Delete");
  fireEvent.click(deleteButtons[0]);

  expect(screen.getByText(/do you want to continue/i)).toBeInTheDocument();

  const modal = screen.getByRole("dialog");

  fireEvent.click(
    within(modal).getByRole("button", { name: "Delete" })
  );

  await waitFor(() => {
    expect(removePatient).toHaveBeenCalledWith(1);
  });

  expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
});
  it("handles fetch error", async () => {
    (getAllPatients as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed to fetch")
    );

    render(<AdminPatients userNameMap={mockUserNameMap} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });
  });
});