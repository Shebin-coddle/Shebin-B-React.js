import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DoctorBookingPage from "../pages/DoctorBookingPage";
import { getDoctorsWithDetails } from "../services/DoctorService";
import { getAllDepartments } from "../services/DepartmentService";
import { getAllUsers } from "../services/UserService";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/DoctorService", () => ({
  getDoctorsWithDetails: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
}));

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn(),
}));

describe("DoctorBookingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getDoctorsWithDetails).mockResolvedValue([
      {
        user_id: 1,
        first_name: "John",
        last_name: "Doe",
        specialization: "Cardiologist",
        department_id: 10,
      },
      {
        user_id: 2,
        first_name: "Jane",
        last_name: "Smith",
        specialization: "Neurologist",
        department_id: 20,
      },
    ] as any);

    vi.mocked(getAllDepartments).mockResolvedValue([
      { id: 10, department_name: "Cardiology" },
      { id: 20, department_name: "Neurology" },
    ] as any);

    vi.mocked(getAllUsers).mockResolvedValue([
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@mail.com",
        phone: "12345",
      },
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@mail.com",
        phone: "67890",
      },
    ] as any);
  });

  it("shows loading initially", () => {
    render(<DoctorBookingPage />);
    expect(screen.getByText(/loading doctors/i)).toBeInTheDocument();
  });

  it("renders doctors after API load", async () => {
    render(<DoctorBookingPage />);

    expect(await screen.findByText(/our specialists/i)).toBeInTheDocument();

    expect(screen.getByText(/Dr. JOHN DOE/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. JANE SMITH/i)).toBeInTheDocument();

    expect(screen.getByText(/Cardiologist/i)).toBeInTheDocument();
    expect(screen.getByText(/Neurologist/i)).toBeInTheDocument();
  });

  it("filters doctors by search", async () => {
    const user = userEvent.setup();
    render(<DoctorBookingPage />);

    await screen.findByText(/our specialists/i);

    const searchInput = screen.getByPlaceholderText(/search doctor/i);

    await user.type(searchInput, "john");

    expect(screen.getByText(/Dr. JOHN DOE/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dr. JANE SMITH/i)).not.toBeInTheDocument();
  });

  it("filters doctors by department", async () => {
    const user = userEvent.setup();
    render(<DoctorBookingPage />);

    await screen.findByText(/our specialists/i);

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "20");

    expect(screen.getByText(/Dr. JANE SMITH/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dr. JOHN DOE/i)).not.toBeInTheDocument();
  });

  it("navigates on book appointment click", async () => {
    const user = userEvent.setup();
    render(<DoctorBookingPage />);

    await screen.findByText(/our specialists/i);

    const buttons = screen.getAllByRole("button", {
      name: /book appointment/i,
    });

    await user.click(buttons[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/patient-book-appointment?doctorId=1",
    );
  });

  it("shows error state", async () => {
    vi.mocked(getDoctorsWithDetails).mockRejectedValue(
      new Error("Failed to load doctors"),
    );

    render(<DoctorBookingPage />);

    expect(
      await screen.findByText(/failed to load doctors/i),
    ).toBeInTheDocument();
  });
});