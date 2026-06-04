import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import AdminPatients from "../pages/admin/AdminPatient";
import * as PatientService from "../services/PatientService";
import type { Patient } from "../types/PatientTypes";

vi.mock("../services/PatientService", () => ({
  getAllPatients: vi.fn(),
  updatePatient: vi.fn(),
}));

const patientMock = vi.mocked(PatientService);

const mockPatients: Patient[] = [
  {
    user_id: 1,
    dob: "2000-01-01T00:00:00.000Z",
    blood_group: "O+",
    created_at: "",
    updated_at: "",
    deleted_at: null,
  },
  {
    user_id: 2,
    dob: "1998-05-20T00:00:00.000Z",
    blood_group: "",
    created_at: "",
    updated_at: "",
    deleted_at: null,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminPatients", () => {
  test("renders loading state", () => {
    patientMock.getAllPatients.mockImplementation(
      () => new Promise(() => {})
    );

    render(<AdminPatients />);

    expect(screen.getByText("Loading patients...")).toBeInTheDocument();
  });

  test("renders patients table", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    expect(screen.getByText("O+")).toBeInTheDocument();
  });

  test("handles fetch error", async () => {
    patientMock.getAllPatients.mockRejectedValue(
      new Error("Failed to fetch patients")
    );

    render(<AdminPatients />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch patients")
      ).toBeInTheDocument();
    });
  });

  test("handles non-error fetch exception", async () => {
    patientMock.getAllPatients.mockRejectedValue("random error");

    render(<AdminPatients />);

    await waitFor(() => {
      expect(
        screen.getByText("Error occurred while fetching patients")
      ).toBeInTheDocument();
    });
  });

  test("opens patient details modal", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("View")[0]);

    expect(
      screen.getByText("Selected Patient Details")
    ).toBeInTheDocument();

expect(
  screen.getAllByText("2000-01-01T00:00:00.000Z")
).toHaveLength(2);  });

  test("closes patient details modal", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("View")[0]);

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(
        screen.queryByText("Selected Patient Details")
      ).not.toBeInTheDocument();
    });
  });

  test("opens edit form", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(screen.getByText("Edit Patient")).toBeInTheDocument();

    expect(screen.getByDisplayValue("O+")).toBeInTheDocument();
  });

  test("updates patient successfully", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);
    patientMock.updatePatient.mockResolvedValue(undefined);

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    const bloodGroupInput = screen.getByDisplayValue("O+");

    fireEvent.change(bloodGroupInput, {
      target: {
        name: "blood_group",
        value: "A+",
      },
    });

fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(patientMock.updatePatient).toHaveBeenCalledWith(1, {
        dob: "2000-01-01",
        blood_group: "A+",
      });
    });
  });

  test("handles update error", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);

    patientMock.updatePatient.mockRejectedValue(
      new Error("Update failed")
    );

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  test("handles non-error update exception", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);

    patientMock.updatePatient.mockRejectedValue("unknown");

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(
        screen.getByText("Error occurred while updating patient")
      ).toBeInTheDocument();
    });
  });

  test("cancel edit form", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("Patients")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByText("Edit Patient")
      ).not.toBeInTheDocument();
    });
  });

  test("renders N/A blood group", async () => {
    patientMock.getAllPatients.mockResolvedValue(mockPatients);

    render(<AdminPatients />);

    await waitFor(() => {
      expect(screen.getByText("N/A")).toBeInTheDocument();
    });
  });
});