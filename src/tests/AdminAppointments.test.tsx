import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

import AdminAppointments from "../pages/admin/AdminAppointment";
import * as AppointmentService from "../services/AppointmentService";
import type { Appointment } from "../types/AppointmentTypes";

vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
  updateAppointment: vi.fn(),
}));

const appointmentMock = vi.mocked(AppointmentService);

const mockAppointments: Appointment[] = [
  {
    id: 1,
    doctor_id: 10,
    patient_id: 20,
    appointment_date: "2026-01-01T00:00:00.000Z",
    start_time: "10:00",
    end_time: "10:30",
    status: "scheduled",
    created_at: "",
    updated_at: "",
    deleted_at: null,
  },
  {
    id: 2,
    doctor_id: 11,
    patient_id: 21,
    appointment_date: "2026-02-01T00:00:00.000Z",
    start_time: "11:00",
    end_time: "11:30",
    status: "completed",
    created_at: "",
    updated_at: "",
    deleted_at: null,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminAppointments", () => {
  test("renders loading state", () => {
    appointmentMock.getAllAppointments.mockImplementation(
      () => new Promise(() => {})
    );

    render(<AdminAppointments />);

    expect(
      screen.getByText("Loading appointments...")
    ).toBeInTheDocument();
  });

  test("renders appointments table", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Appointments")).toBeInTheDocument();
    });

    expect(screen.getByText("scheduled")).toBeInTheDocument();
  });

  test("handles fetch error", async () => {
    appointmentMock.getAllAppointments.mockRejectedValue(
      new Error("Failed to fetch appointments")
    );

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch appointments")
      ).toBeInTheDocument();
    });
  });

  test("handles non-error fetch exception", async () => {
    appointmentMock.getAllAppointments.mockRejectedValue("random error");

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(
        screen.getByText("Error occurred while fetching appointments")
      ).toBeInTheDocument();
    });
  });

  test("opens appointment details modal", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Appointments")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("View")[0]);

    expect(
      screen.getByText("Selected Appointment Details")
    ).toBeInTheDocument();
  });

  test("closes appointment details modal", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Appointments")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("View")[0]);

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(
        screen.queryByText("Selected Appointment Details")
      ).not.toBeInTheDocument();
    });
  });

  test("opens edit form", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Appointments")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(screen.getByText("Edit Appointment")).toBeInTheDocument();

    expect(screen.getByDisplayValue("10:00")).toBeInTheDocument();
  });

  test("updates appointment successfully", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);
    appointmentMock.updateAppointment.mockResolvedValue(undefined);

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Appointments")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

const statusSelect = screen.getByRole("combobox");
    fireEvent.change(statusSelect, {
      target: {
        name: "status",
        value: "completed",
      },
    });

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(appointmentMock.updateAppointment).toHaveBeenCalledWith(1, {
        appointment_date: "2026-01-01",
        start_time: "10:00",
        end_time: "10:30",
        status: "completed",
      });
    });
  });

  test("handles update error", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    appointmentMock.updateAppointment.mockRejectedValue(
      new Error("Update failed")
    );

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Appointments")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  test("handles non-error update exception", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    appointmentMock.updateAppointment.mockRejectedValue("unknown");

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Appointments")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(
        screen.getByText("Error occurred while updating appointment")
      ).toBeInTheDocument();
    });
  });

  test("cancel edit form", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(screen.getByText("Appointments")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByText("Edit Appointment")
      ).not.toBeInTheDocument();
    });
  });

  test("renders appointment data", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    render(<AdminAppointments />);

    await waitFor(() => {
      expect(
        screen.getByText("2026-01-01T00:00:00.000Z")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});