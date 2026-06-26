import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminAppointments from "../pages/admin/AdminAppointment";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
  removeAppointment: vi.fn(),
}));

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn(),
}));


vi.mock("../components/DeleteModal", () => ({
  default: ({
    open,
    onConfirm,
    onCancel,
  }: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }) =>
    open ? (
      <div>
        <p>Delete Appointment</p>
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onCancel}>Cancel Delete</button>
      </div>
    ) : null,
}));

import {
  getAllAppointments,
  removeAppointment,
} from "../services/AppointmentService";
import { getAllUsers } from "../services/UserService";

describe("AdminAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (getAllAppointments as any).mockResolvedValue([
      {
        id: 1,
        doctor_id: 10,
        patient_id: 20,
        appointment_date: "2025-01-10",
        start_time: "09:00",
        end_time: "10:00",
        status: "booked",
      },
    ]);

    (getAllUsers as any).mockResolvedValue([
      {
        id: 10,
        first_name: "John",
        last_name: "Doctor",
      },
      {
        id: 20,
        first_name: "Jane",
        last_name: "Patient",
      },
    ]);
  });

  function renderComponent() {
    return render(
      <BrowserRouter>
        <AdminAppointments />
      </BrowserRouter>,
    );
  }

  it("renders appointments page", async () => {
    renderComponent();

    expect(await screen.findByText("Appointments")).toBeInTheDocument();
    expect(await screen.findByText("Dr.John Doctor")).toBeInTheDocument();
    expect(await screen.findByText("Jane Patient")).toBeInTheDocument();
  });

  it("shows loading initially", () => {
    (getAllAppointments as any).mockImplementation(() => new Promise(() => {}));

    renderComponent();

    expect(screen.getByText("Loading appointments...")).toBeInTheDocument();
  });

  it("shows fetch error", async () => {
    (getAllAppointments as any).mockRejectedValue(
      new Error("Failed to fetch appointments"),
    );

    renderComponent();

    expect(
      await screen.findByText("Failed to fetch appointments"),
    ).toBeInTheDocument();
  });

  it("handles user fetch failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    (getAllUsers as any).mockRejectedValue(new Error("User error"));

    renderComponent();

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });

  it("navigates to add appointment page", async () => {
    renderComponent();

    fireEvent.click(await screen.findByText("Add appointment"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-appointments/add");
  });

  it("navigates to edit appointment page", async () => {
    renderComponent();

    fireEvent.click(await screen.findByText("Edit"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-appointments/edit/1");
  });

  it("opens delete modal", async () => {
    renderComponent();

    fireEvent.click(await screen.findByText("Delete"));

    expect(screen.getByText("Delete Appointment")).toBeInTheDocument();
  });

  it("closes delete modal", async () => {
    renderComponent();

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Cancel Delete"));

    await waitFor(() => {
      expect(screen.queryByText("Delete Appointment")).not.toBeInTheDocument();
    });
  });

  it("deletes appointment successfully", async () => {
    (removeAppointment as any).mockResolvedValue(undefined);

    renderComponent();

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(removeAppointment).toHaveBeenCalledWith(1);
    });
  });

  it("handles delete failure", async () => {
    (removeAppointment as any).mockRejectedValue(new Error("Delete failed"));

    renderComponent();

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
  });

  it("filters appointments by search text", async () => {
    renderComponent();

    await screen.findByText("Dr.John Doctor");

    fireEvent.change(
      screen.getByPlaceholderText("Search by patient/doctor name"),
      {
        target: { value: "unknown" },
      },
    );

    expect(screen.queryByText("Dr.John Doctor")).not.toBeInTheDocument();
  });

  it("filters appointments by date", async () => {
    renderComponent();

    await screen.findByText("Dr.John Doctor");

    const dateInput = document.querySelector(
      'input[type="date"]',
    ) as HTMLInputElement;

    fireEvent.change(dateInput, {
      target: { value: "2025-02-01" },
    });

    expect(screen.queryByText("Dr.John Doctor")).not.toBeInTheDocument();
  });

  it("clears filters", async () => {
    renderComponent();

    await screen.findByText("Dr.John Doctor");

    fireEvent.change(
      screen.getByPlaceholderText("Search by patient/doctor name"),
      {
        target: { value: "abc" },
      },
    );

    fireEvent.click(screen.getByText("Clear Filters"));

    expect(
      screen.getByPlaceholderText("Search by patient/doctor name"),
    ).toHaveValue("");
  });
});
