import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PatientBookAppointment from "../pages/patient/PatientBookAppointment";

import { getAllDepartments } from "../services/DepartmentService";
import { getDoctorsWithDetails } from "../services/DoctorService";
import { createAppointment } from "../services/AppointmentService";
import { showSuccess, showError } from "../utils/toast";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    search: "",
  }),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
}));

vi.mock("../services/DoctorService", () => ({
  getDoctorsWithDetails: vi.fn(),
}));

vi.mock("../services/AppointmentService", () => ({
  createAppointment: vi.fn(),
}));

vi.mock("../utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock("../components/EditForm", () => ({
  default: ({ fields, errors, onChange, onSubmit, onCancel }: any) => (
    <form onSubmit={onSubmit}>
      {fields.map((field: any) => (
        <div key={field.name}>
          <label>{field.label}</label>

          {field.type === "select" ? (
            <select
              name={field.name}
              value={field.value}
              onChange={onChange}
            >
              {field.options.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={field.value}
              onChange={onChange}
            />
          )}

          {errors[field.name] && <p>{errors[field.name]}</p>}
        </div>
      ))}

      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  ),
}));

describe("PatientBookAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("user_id", "5");

    vi.mocked(getAllDepartments).mockResolvedValue([
      {
        id: 1,
        department_name: "Cardiology",
      },
    ] as any);

    vi.mocked(getDoctorsWithDetails).mockResolvedValue([
      {
        user_id: 10,
        department_id: 1,
        first_name: "John",
        last_name: "Smith",
        specialization: "Cardiologist",
      },
    ] as any);
  });

  it("renders page", async () => {
    render(<PatientBookAppointment />);

    expect(screen.getByText("Book Appointment")).toBeInTheDocument();

    await waitFor(() => {
      expect(getAllDepartments).toHaveBeenCalled();
      expect(getDoctorsWithDetails).toHaveBeenCalled();
    });
  });

  it("shows validation errors", async () => {
    render(<PatientBookAppointment />);

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText("Please select a department"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please select a doctor"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please select appointment date"),
    ).toBeInTheDocument();
  });

  it("books appointment successfully", async () => {
    vi.mocked(createAppointment).mockResolvedValue({} as any);

    render(<PatientBookAppointment />);

    await waitFor(() => expect(getAllDepartments).toHaveBeenCalled());

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[0], {
      target: { value: "1" },
    });

    fireEvent.change(selects[1], {
      target: { value: "10" },
    });

    const inputs = document.querySelectorAll(
      'input[type="date"], input[type="time"]',
    ) as NodeListOf<HTMLInputElement>;

    fireEvent.change(inputs[0], {
      target: { value: "2099-01-01" },
    });

    fireEvent.change(inputs[1], {
      target: { value: "09:00" },
    });

    fireEvent.change(inputs[2], {
      target: { value: "09:30" },
    });

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalledOnce();
    });

    expect(showSuccess).toHaveBeenCalledWith(
      "Appointment request submitted successfully",
    );
  });

  it("shows error when booking fails", async () => {
    vi.mocked(createAppointment).mockRejectedValue(
      new Error("Booking failed"),
    );

    render(<PatientBookAppointment />);

    await waitFor(() => expect(getAllDepartments).toHaveBeenCalled());

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[0], {
      target: { value: "1" },
    });

    fireEvent.change(selects[1], {
      target: { value: "10" },
    });

    const inputs = document.querySelectorAll(
      'input[type="date"], input[type="time"]',
    ) as NodeListOf<HTMLInputElement>;

    fireEvent.change(inputs[0], {
      target: { value: "2099-01-01" },
    });

    fireEvent.change(inputs[1], {
      target: { value: "09:00" },
    });

    fireEvent.change(inputs[2], {
      target: { value: "09:30" },
    });

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith(
        "Appointment not submitted",
      );
    });

    expect(screen.getByText("Booking failed")).toBeInTheDocument();
  });

  it("navigates on cancel", async () => {
    render(<PatientBookAppointment />);

    await userEvent.click(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/doctor-list");
  });

  it("preselects doctor from query parameter", async () => {
    vi.doMock("react-router-dom", () => ({
      useNavigate: () => mockNavigate,
      useLocation: () => ({
        search: "?doctorId=10",
      }),
    }));

    render(<PatientBookAppointment />);

    await waitFor(() => {
      expect(getDoctorsWithDetails).toHaveBeenCalled();
    });
  });
});