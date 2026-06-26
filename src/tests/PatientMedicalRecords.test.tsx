import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PatientMedicalRecords from "../pages/patient/PatientMedicalRecords";
import { getMedicalRecordsByPatientId } from "../services/MedicalRecordService";

vi.mock("../services/MedicalRecordService", () => ({
  getMedicalRecordsByPatientId: vi.fn(),
}));

vi.mock("../components/table/DataTable", () => ({
  default: ({ columns, data }: any) => (
    <table>
      <tbody>
        {data.map((row: any) => (
          <tr key={row.id}>
            {columns.map((column: any) => (
              <td key={column.header}>
                {column.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

vi.mock("../components/DetailsView", () => ({
  default: ({ title, details, onClose }: any) => (
    <div>
      <h3>{title}</h3>

      {details.map((detail: any) => (
        <p key={`${detail.label}-${detail.value}`}>
          {detail.label}: {detail.value}
        </p>
      ))}

      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("PatientMedicalRecords", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("user_id", "1");

    vi.mocked(getMedicalRecordsByPatientId).mockResolvedValue([
      {
        id: 1,
        patient_id: 1,
        medical_condition: "Diabetes",
        treatment: "Medication",
        status: "Active",
        diagnosis_date: "2026-01-10",
      },
      {
        id: 2,
        patient_id: 1,
        medical_condition: "Hypertension",
        treatment: "Exercise",
        status: "Recovered",
        diagnosis_date: "2026-02-15",
      },
    ] as any);
  });

  it("shows loading initially", () => {
    render(<PatientMedicalRecords />);
    expect(screen.getByText(/loading medical records/i)).toBeInTheDocument();
  });

  it("renders medical records", async () => {
    render(<PatientMedicalRecords />);

    expect(await screen.findByText(/my medical records/i)).toBeInTheDocument();

    expect(screen.getByText("Diabetes")).toBeInTheDocument();
    expect(screen.getByText("Medication")).toBeInTheDocument();
    expect(screen.getByText("Hypertension")).toBeInTheDocument();
    expect(screen.getByText("Exercise")).toBeInTheDocument();
  });

  it("opens detail card", async () => {
    const user = userEvent.setup();

    render(<PatientMedicalRecords />);

    const viewButtons = await screen.findAllByRole("button", {
      name: /view/i,
    });

    await user.click(viewButtons[0]);

    expect(screen.getByText(/selected medical record/i)).toBeInTheDocument();

    expect(screen.getByText(/diagnosis: diabetes/i)).toBeInTheDocument();
    expect(screen.getByText(/treatment: medication/i)).toBeInTheDocument();
    expect(screen.getByText(/status:\s*active/i)).toBeInTheDocument();
  });

  it("closes detail card", async () => {
    const user = userEvent.setup();

    render(<PatientMedicalRecords />);

    const viewButtons = await screen.findAllByRole("button", {
      name: /view/i,
    });

    await user.click(viewButtons[0]);

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(
      screen.queryByText(/selected medical record/i)
    ).not.toBeInTheDocument();
  });

  it("shows error when API fails", async () => {
    vi.mocked(getMedicalRecordsByPatientId).mockRejectedValue(
      new Error("Server Error")
    );

    render(<PatientMedicalRecords />);

    expect(await screen.findByText(/server error/i)).toBeInTheDocument();
  });

  it("calls service with logged-in patient id", async () => {
    render(<PatientMedicalRecords />);

    await screen.findByText(/my medical records/i);

    expect(getMedicalRecordsByPatientId).toHaveBeenCalledWith(1);
  });
});