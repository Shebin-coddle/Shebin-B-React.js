import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AppointmentForm from "../pages/admin/AppointmentForm";
import { getAllUsers } from "../services/UserService";
import { getAppointmentById, createAppointment, updateAppointment } from "../services/AppointmentService";
import { showSuccess, showError } from "../utils/toast";

const mockNavigate = vi.fn();
let mockParams: Record<string, string> = {};

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn(),
}));

vi.mock("../services/AppointmentService", () => ({
  getAppointmentById: vi.fn(),
  createAppointment: vi.fn(),
  updateAppointment: vi.fn(),
}));

vi.mock("../utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

describe("AppointmentForm Page Component", () => {
  const mockUsers = [
    { id: 10, first_name: "John", last_name: "Smith", role_id: 2 },
    { id: 20, first_name: "Jane", last_name: "Doe", role_id: 3 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = {};
    vi.mocked(getAllUsers).mockResolvedValue(mockUsers as any);
  });

  it("should display layout text and resolve mappings on mount", async () => {
    await act(async () => {
      render(<AppointmentForm />);
    });

    expect(screen.getByText("Add Appointment")).toBeInTheDocument();
  });

  it("should log errors cleanly if user mapping fetching fails on lifecycle mount", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getAllUsers).mockRejectedValue(new Error("Network Error"));

    await act(async () => {
      render(<AppointmentForm />);
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should cancel updates and navigate back to administration listing matrix", async () => {
    await act(async () => {
      render(<AppointmentForm />);
    });

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin-appointments");
  });

  it("should update form state variables dynamically when inputs experience mutations", async () => {
    const { container } = render(<AppointmentForm />);
    await act(async () => {});

    const docSelect = container.querySelector("#doctor_id") as HTMLSelectElement;
    fireEvent.change(docSelect, { target: { name: "doctor_id", value: "10" } });
    expect(docSelect.value).toBe("10");

    fireEvent.change(docSelect, { target: { name: "doctor_id", value: "0" } });
    expect(docSelect.value).toBe("0");
  });

  it("should trigger validation errors when required layout blocks are absent on creation save", async () => {
    const { container } = render(<AppointmentForm />);
    await act(async () => {});

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(screen.getByText("Doctor is required")).toBeInTheDocument();
    expect(screen.getByText("Patient is required")).toBeInTheDocument();
    expect(screen.getByText("Date is required")).toBeInTheDocument();
    expect(screen.getByText("Start time is required")).toBeInTheDocument();
    expect(screen.getByText("End time is required")).toBeInTheDocument();
    expect(screen.getByText("Status is required")).toBeInTheDocument();
  });

  it("should trigger validation boundary flags if chronological order is broken", async () => {
    const { container } = render(<AppointmentForm />);
    await act(async () => {});

    fireEvent.change(container.querySelector("#doctor_id")!, { target: { name: "doctor_id", value: "10" } });
    fireEvent.change(container.querySelector("#patient_id")!, { target: { name: "patient_id", value: "20" } });
    fireEvent.change(container.querySelector("#appointment_date")!, { target: { name: "appointment_date", value: "2026-06-25" } });
    fireEvent.change(container.querySelector("#start_time")!, { target: { name: "start_time", value: "14:00" } });
    fireEvent.change(container.querySelector("#end_time")!, { target: { name: "end_time", value: "13:00" } });
    fireEvent.change(container.querySelector("#status")!, { target: { name: "status", value: "booked" } });

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(screen.getByText("End time must be after start time")).toBeInTheDocument();
  });

  it("should submit validated payloads successfully and route to root table directory", async () => {
    vi.mocked(createAppointment).mockResolvedValue({} as any);
    const { container } = render(<AppointmentForm />);
    await act(async () => {});

    fireEvent.change(container.querySelector("#doctor_id")!, { target: { name: "doctor_id", value: "10" } });
    fireEvent.change(container.querySelector("#patient_id")!, { target: { name: "patient_id", value: "20" } });
    fireEvent.change(container.querySelector("#appointment_date")!, { target: { name: "appointment_date", value: "2026-06-25" } });
    fireEvent.change(container.querySelector("#start_time")!, { target: { name: "start_time", value: "10:00" } });
    fireEvent.change(container.querySelector("#end_time")!, { target: { name: "end_time", value: "11:00" } });
    fireEvent.change(container.querySelector("#status")!, { target: { name: "status", value: "booked" } });

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(createAppointment).toHaveBeenCalledWith({
      doctor_id: 10,
      patient_id: 20,
      appointment_date: "2026-06-25",
      start_time: "10:00",
      end_time: "11:00",
      status: "booked",
    });
    expect(showSuccess).toHaveBeenCalledWith("Appointment created successfully");
    expect(mockNavigate).toHaveBeenCalledWith("/admin-appointments");
  });

  it("should load configuration properties cleanly when routing context defines edit parameters", async () => {
    mockParams = { id: "55" };
    const mockRecord = {
      doctor_id: 10,
      patient_id: 20,
      appointment_date: "2026-06-25T00:00:00.000Z",
      start_time: "09:00",
      end_time: "10:00",
      status: "booked",
    };
    vi.mocked(getAppointmentById).mockResolvedValue(mockRecord as any);

    const { container } = render(<AppointmentForm />);
    await act(async () => {});

    expect(getAppointmentById).toHaveBeenCalledWith(55);
    expect((container.querySelector("#start_time") as HTMLInputElement).value).toBe("09:00");
  });

  it("should fallback cleanly if database returns array layout on targeted information collection fetch", async () => {
    mockParams = { id: "55" };
    vi.mocked(getAppointmentById).mockResolvedValue([
      {
        doctor_id: 10,
        patient_id: 20,
        appointment_date: "",
        start_time: "15:00",
        end_time: "16:00",
        status: "completed",
      },
    ] as any);

    const { container } = render(<AppointmentForm />);
    await act(async () => {});

    expect((container.querySelector("#start_time") as HTMLInputElement).value).toBe("15:00");
  });

  it("should process structural updates through active amendment profiles when save confirms changes", async () => {
    mockParams = { id: "55" };
    vi.mocked(getAppointmentById).mockResolvedValue({
      doctor_id: 10,
      patient_id: 20,
      appointment_date: "2026-06-25",
      start_time: "09:00",
      end_time: "10:00",
      status: "booked",
    } as any);
    vi.mocked(updateAppointment).mockResolvedValue({} as any);

    const { container } = render(<AppointmentForm />);
    await act(async () => {});

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(updateAppointment).toHaveBeenCalledWith(55, {
      appointment_date: "2026-06-25",
      start_time: "09:00",
      end_time: "10:00",
      status: "booked",
    });
    expect(showSuccess).toHaveBeenCalledWith("Details Updated");
  });

  it("should yield display notifications if transactional mutations fail under interface submissions", async () => {
    vi.mocked(createAppointment).mockRejectedValue(new Error("Database write error"));
    const { container } = render(<AppointmentForm />);
    await act(async () => {});

    fireEvent.change(container.querySelector("#doctor_id")!, { target: { name: "doctor_id", value: "10" } });
    fireEvent.change(container.querySelector("#patient_id")!, { target: { name: "patient_id", value: "20" } });
    fireEvent.change(container.querySelector("#appointment_date")!, { target: { name: "appointment_date", value: "2026-06-25" } });
    fireEvent.change(container.querySelector("#start_time")!, { target: { name: "start_time", value: "10:00" } });
    fireEvent.change(container.querySelector("#end_time")!, { target: { name: "end_time", value: "11:00" } });
    fireEvent.change(container.querySelector("#status")!, { target: { name: "status", value: "booked" } });

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(showError).toHaveBeenCalledWith("Appointment not created");
    expect(screen.getByText("Database write error")).toBeInTheDocument();
  });

  it("should show plain fallback message when structural error is an unknown throw", async () => {
    mockParams = { id: "55" };
    vi.mocked(getAppointmentById).mockRejectedValue("Unknown error structure");

    render(<AppointmentForm />);
    await act(async () => {});

    expect(screen.getByText("Error loading data")).toBeInTheDocument();
  });
});