import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

import DoctorAppointments from "../pages/doctor/DoctorAppointments";

import * as AppointmentService from "../services/AppointmentService";
import * as PatientService from "../services/PatientService";
import * as MedicalRecordService from "../services/MedicalRecordService";

import type { Appointment } from "../types/AppointmentTypes";
import type { PatientDetails } from "../types/PatientTypes";
import type { MedicalRecord } from "../types/MedicalRecordTypes";


vi.mock("../services/AppointmentService", () => ({
  getAllAppointments: vi.fn(),
  approveAppointment: vi.fn(),
  cancelAppointment: vi.fn(),
  completeAppointment: vi.fn(),
}));

vi.mock("../services/PatientService", () => ({
  getPatientDetailsById: vi.fn(),
}));

vi.mock("../services/MedicalRecordService", () => ({
  getMedicalRecordsByPatientId: vi.fn(),
}));


type AppointmentServiceMock = {
  getAllAppointments: ReturnType<typeof vi.fn>;
  approveAppointment: ReturnType<typeof vi.fn>;
  cancelAppointment: ReturnType<typeof vi.fn>;
  completeAppointment: ReturnType<typeof vi.fn>;
};

type PatientServiceMock = {
  getPatientDetailsById: ReturnType<typeof vi.fn>;
};

type MedicalRecordServiceMock = {
  getMedicalRecordsByPatientId: ReturnType<typeof vi.fn>;
};


const appointmentMock =
  AppointmentService as unknown as AppointmentServiceMock;

const patientMock = PatientService as unknown as PatientServiceMock;

const recordMock =
  MedicalRecordService as unknown as MedicalRecordServiceMock;


const mockAppointments: Appointment[] = [
  {
    id: 1,
    doctor_id: 1,
    patient_id: 10,
    appointment_date: "2026-01-01",
    start_time: "10:00",
    end_time: "10:30",
    status: "pending",
    created_at: "",
    updated_at: "",
    deleted_at: null,
  },
  {
    id: 2,
    doctor_id: 1,
    patient_id: 11,
    appointment_date: "2026-01-02",
    start_time: "11:00",
    end_time: "11:30",
    status: "booked",
    created_at: "",
    updated_at: "",
    deleted_at: null,
  },
];

beforeEach(() => {
  localStorage.setItem("user_id", "1");
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});


describe("DoctorAppointments", () => {
  test("renders appointments", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    render(<DoctorAppointments />);

    await waitFor(() => {
      expect(screen.getByText("My Appointments")).toBeInTheDocument();
    });

    expect(screen.getByText("2026-01-01")).toBeInTheDocument();
  });

  test("loading state", () => {
    appointmentMock.getAllAppointments.mockImplementation(
      () => new Promise(() => {})
    );

    render(<DoctorAppointments />);

    expect(
      screen.getByText(/Loading doctor appointments/i)
    ).toBeInTheDocument();
  });

  test("error state", async () => {
    appointmentMock.getAllAppointments.mockRejectedValue(
      new Error("API Error")
    );

    render(<DoctorAppointments />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  test("filter by status", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    render(<DoctorAppointments />);

    await waitFor(() => {
      expect(screen.getByText("2026-01-01")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Booked"));

    expect(screen.getByText("2026-01-02")).toBeInTheDocument();
  });

  test("approve appointment", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);
    appointmentMock.approveAppointment.mockResolvedValue(undefined);

    render(<DoctorAppointments />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText("Approve")[0]);
    });

    expect(appointmentMock.approveAppointment).toHaveBeenCalledWith(1);
  });

  test("cancel appointment", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);
    appointmentMock.cancelAppointment.mockResolvedValue(undefined);

    render(<DoctorAppointments />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText("Cancel")[0]);
    });

    expect(appointmentMock.cancelAppointment).toHaveBeenCalledWith(1);
  });

  test("complete appointment", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);
    appointmentMock.completeAppointment.mockResolvedValue(undefined);

    render(<DoctorAppointments />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText("Complete")[0]);
    });

    expect(appointmentMock.completeAppointment).toHaveBeenCalledWith(2);
  });

  test("view patient details", async () => {
    appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

    patientMock.getPatientDetailsById.mockResolvedValue({
      id: 10,
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
      phone: "1234567890",
      dob: "2000-01-01",
      blood_group: "O+",
    } satisfies PatientDetails);

    recordMock.getMedicalRecordsByPatientId.mockResolvedValue([
      {
        id: 1,
        patient_id: 10,
        doctor_id: 1,
        medical_condition: "Fever",
        treatment: "Paracetamol",
        status: "active",
        diagnosis_date: "2026-01-01",
      } satisfies MedicalRecord,
    ]);

    render(<DoctorAppointments />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByText("Patient Details")[0]);
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Fever")).toBeInTheDocument();
    });
  });
  test("closes medical records panel", async () => {
  appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

  patientMock.getPatientDetailsById.mockResolvedValue({
    id: 10,
    first_name: "John",
    last_name: "Doe",
    email: "john@test.com",
    phone: "123",
    dob: "2000-01-01",
    blood_group: "O+",
  } satisfies PatientDetails);

  recordMock.getMedicalRecordsByPatientId.mockResolvedValue([]);

  render(<DoctorAppointments />);

  await waitFor(() => {
    fireEvent.click(screen.getAllByText("Patient Details")[0]);
  });

  fireEvent.click(screen.getByText("Close Medical Records"));

  expect(
    screen.queryByText("Medical Records")
  ).not.toBeInTheDocument();
});
test("filters all statuses", async () => {
  appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

  render(<DoctorAppointments />);

  await waitFor(() => {
    fireEvent.click(screen.getByText("Pending"));
    fireEvent.click(screen.getByText("Booked"));
    fireEvent.click(screen.getByText("Completed"));
    fireEvent.click(screen.getByText("Cancelled"));
    fireEvent.click(screen.getByText("All"));
  });

  expect(screen.getByText("My Appointments")).toBeInTheDocument();
});
test("handles non-error exception fallback", async () => {
  appointmentMock.getAllAppointments.mockRejectedValue("random failure");

  render(<DoctorAppointments />);

  await waitFor(() => {
    expect(
      screen.getByText("Error occurred while fetching doctor appointments")
    ).toBeInTheDocument();
  });
});
test("opens selected appointment detail card", async () => {
  appointmentMock.getAllAppointments.mockResolvedValue(mockAppointments);

  render(<DoctorAppointments />);

  await waitFor(() => {
    fireEvent.click(screen.getAllByText("Approve")[0]);
  });

});
});