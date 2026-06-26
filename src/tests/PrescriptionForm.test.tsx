import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PrescriptionForm from "../pages/doctor/PrescriptionForm";

import { getAllMedicines } from "../services/MedicineService";

import { getPatientDetailsById } from "../services/PatientService";

import { createFullPrescription } from "../services/PrescriptionService";

import { showSuccess, showError } from "../utils/toast";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({
    patientId: "1",
  }),
}));

vi.mock("../services/MedicineService", () => ({
  getAllMedicines: vi.fn(),
}));

vi.mock("../services/PatientService", () => ({
  getPatientDetailsById: vi.fn(),
}));

vi.mock("../services/PrescriptionService", () => ({
  createFullPrescription: vi.fn(),
}));

vi.mock("../utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

describe("PrescriptionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("user_id", "10");

    vi.mocked(getAllMedicines).mockResolvedValue([
      {
        id: 1,
        medicine_name: "Paracetamol",
      },
      {
        id: 2,
        medicine_name: "Amoxicillin",
      },
    ] as any);

    vi.mocked(getPatientDetailsById).mockResolvedValue({
      id: 1,
      first_name: "John",
      last_name: "Doe",
    } as any);
  });

  it("renders form", async () => {
    render(<PrescriptionForm />);

    expect(screen.getByText("Create Prescription")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  it("loads medicines", async () => {
    render(<PrescriptionForm />);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Paracetamol" }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", { name: "Amoxicillin" }),
      ).toBeInTheDocument();
    });
  });

  it("shows validation errors", async () => {
    render(<PrescriptionForm />);

    const saveButton = screen.getByRole("button", {
      name: /save prescription/i,
    });

    await userEvent.click(saveButton);

    expect(await screen.findByText("Medicine is required")).toBeInTheDocument();

    expect(screen.getByText("Dosage is required")).toBeInTheDocument();

    expect(screen.getByText("Start date is required")).toBeInTheDocument();

    expect(screen.getByText("End date is required")).toBeInTheDocument();
  });

  it("adds another medicine", async () => {
    render(<PrescriptionForm />);

    expect(screen.getAllByRole("combobox")).toHaveLength(1);

    await userEvent.click(
      screen.getByRole("button", {
        name: /add medicine/i,
      }),
    );

    expect(screen.getAllByRole("combobox")).toHaveLength(2);
  });

  it("removes medicine", async () => {
    render(<PrescriptionForm />);

    await userEvent.click(
      screen.getByRole("button", {
        name: /add medicine/i,
      }),
    );

    const removeButtons = screen.getAllByRole("button", {
      name: /remove/i,
    });

    await userEvent.click(removeButtons[0]);

    expect(screen.getAllByRole("combobox")).toHaveLength(1);
  });

  it("submits successfully", async () => {
    vi.mocked(createFullPrescription).mockResolvedValue({} as any);

    render(<PrescriptionForm />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: {
        value: "1",
      },
    });

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: {
        value: "2 tablets",
      },
    });

    const dateInputs = document.querySelectorAll('input[type="date"]');

    fireEvent.change(dateInputs[0], {
      target: {
        value: "2026-01-01",
      },
    });

    fireEvent.change(dateInputs[1], {
      target: {
        value: "2026-01-05",
      },
    });
    await userEvent.click(
      screen.getByRole("button", {
        name: /save prescription/i,
      }),
    );

    await waitFor(() => {
      expect(createFullPrescription).toHaveBeenCalledOnce();
    });

    expect(showSuccess).toHaveBeenCalledWith(
      "Prescription created successfully",
    );

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("shows error if submission fails", async () => {
    vi.mocked(createFullPrescription).mockRejectedValue(new Error("API Error"));

    render(<PrescriptionForm />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: {
        value: "1",
      },
    });

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: {
        value: "2 tablets",
      },
    });

    const dateInputs = document.querySelectorAll(
      'input[type="date"]',
    ) as NodeListOf<HTMLInputElement>;

    fireEvent.change(dateInputs[0], {
      target: {
        value: "2026-01-01",
      },
    });

    fireEvent.change(dateInputs[1], {
      target: {
        value: "2026-01-05",
      },
    });
    await userEvent.click(
      screen.getByRole("button", {
        name: /save prescription/i,
      }),
    );

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith("Failed to create prescription");
    });
  });
});
