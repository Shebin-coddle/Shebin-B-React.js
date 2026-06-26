import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NurseAppointments from "../pages/nurse/NurseAppointments";

import { getNurseById } from "../services/NurseService";
import { getDoctorsWithDetails } from "../services/DoctorService";
import { getAllAppointments } from "../services/AppointmentService";
import { getPatientDetailsById } from "../services/PatientService";

vi.mock("../services/NurseService", () => ({
  getNurseById: vi.fn(),
}));

vi.mock("../components/table/DataTable", () => ({
  default: ({ columns, data }: any) => (
    <table>
      <tbody>
        {data.map((row: any) => (
          <tr key={row.id ?? JSON.stringify(row)}>
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

vi.mock("../services/DoctorService", () => ({
  getDoctorsWithDetails: vi.fn(),
}));

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
}));

vi.mock("../services/PatientService", () => ({
  getPatientDetailsById: vi.fn(),
}));



vi.mock("../components/DetailsView", () => ({
  default: ({ title, details, onClose }: any) => (
    <div>
      <h3>{title}</h3>

      {details.map((detail: any) => (
        <p key={detail.label}>
          {detail.label}: {detail.value}
        </p>
      ))}

      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("NurseAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("user_id", "5");

    vi.mocked(getNurseById).mockResolvedValue({
      id: 5,
      department_id: 1,
    } as any);

    vi.mocked(getDoctorsWithDetails).mockResolvedValue([
      {
        user_id: 10,
        department_id: 1,
        first_name: "John",
        last_name: "Smith",
      },
      {
        user_id: 11,
        department_id: 2,
        first_name: "Alice",
        last_name: "Brown",
      },
    ] as any);

    vi.mocked(getAllAppointments).mockResolvedValue([
      {
        id: 1,
        doctor_id: 10,
        patient_id: 100,
        appointment_date: "2026-01-01",
        start_time: "09:00",
        end_time: "09:30",
        status: "booked",
      },
    ] as any);

    vi.mocked(getPatientDetailsById).mockResolvedValue({
      id: 100,
      first_name: "Jane",
      last_name: "Doe",
    } as any);
  });

  it("renders heading", async () => {
    render(<NurseAppointments />);

    expect(
      await screen.findByText("Department Appointments"),
    ).toBeInTheDocument();
  });

  it("loads appointment data", async () => {
    render(<NurseAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Dr. John Smith")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("booked")).toBeInTheDocument();
    });
  });

  it("opens appointment details", async () => {
    render(<NurseAppointments />);

    const viewButton = await screen.findByRole("button", {
      name: /view/i,
    });

    await userEvent.click(viewButton);

    expect(
      screen.getByText("Selected Appointment Details"),
    ).toBeInTheDocument();

    expect(screen.getByText(/Doctor:/)).toBeInTheDocument();
    expect(screen.getByText(/Patient:/)).toBeInTheDocument();
  });

  it("closes detail card", async () => {
    render(<NurseAppointments />);

    await userEvent.click(
      await screen.findByRole("button", {
        name: /view/i,
      }),
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: /close/i,
      }),
    );

    expect(
      screen.queryByText("Selected Appointment Details"),
    ).not.toBeInTheDocument();
  });

  it("filters by status", async () => {
    render(<NurseAppointments />);

    await screen.findByText("Department Appointments");

    fireEvent.change(screen.getByRole("combobox"), {
      target: {
        value: "booked",
      },
    });

    expect(screen.getByText("booked")).toBeInTheDocument();
  });

  it("filters by date", async () => {
    render(<NurseAppointments />);

    await screen.findByText("Department Appointments");

    const dateInput = document.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement;

    fireEvent.change(dateInput, {
      target: {
        value: "2026-01-01",
      },
    });

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("clears filters", async () => {
    render(<NurseAppointments />);

    await screen.findByText("Department Appointments");

    const dateInput = document.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement;

    fireEvent.change(dateInput, {
      target: {
        value: "2026-01-01",
      },
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: {
        value: "booked",
      },
    });

    await userEvent.click(
      screen.getByRole("button", {
        name: /clear filters/i,
      }),
    );

    expect(dateInput.value).toBe("");
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("shows error message when service fails", async () => {
    vi.mocked(getNurseById).mockRejectedValue(new Error("Server Error"));

    render(<NurseAppointments />);

    expect(await screen.findByText("Server Error")).toBeInTheDocument();
  });
});