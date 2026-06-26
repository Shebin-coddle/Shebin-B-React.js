import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Profile from "../pages/Profile";
import * as UserService from "../services/UserService";
import * as DepartmentService from "../services/DepartmentService";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/UserService", () => ({
  getCompleteUser: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
}));

describe("Profile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("user_id", "1");
  });

  it("shows loading initially", () => {
    vi.mocked(UserService.getCompleteUser).mockImplementation(
      () => new Promise(() => {})
    );

    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading profile/i)).toBeInTheDocument();
  });

  it("renders patient profile", async () => {
    vi.mocked(UserService.getCompleteUser).mockResolvedValue({
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
      phone: "9876543210",
      role_id: 3,

      street_name: "Main Road",
      city: "Kochi",
      district: "Ernakulam",
      state: "Kerala",
      pincode: "682001",

      dob: "2000-01-01",
      blood_group: "O+",
    } as any);

    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(await screen.findByText("JOHN DOE")).toBeInTheDocument();

    expect(screen.getByText("john@test.com")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("Main Road")).toBeInTheDocument();
    expect(screen.getByText("Kochi")).toBeInTheDocument();
    expect(screen.getByText("Ernakulam")).toBeInTheDocument();
    expect(screen.getByText("Kerala")).toBeInTheDocument();
    expect(screen.getByText("682001")).toBeInTheDocument();
    expect(screen.getByText("O+")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Edit Profile/i })).toBeInTheDocument();
  });

  it("navigates when Edit Profile is clicked", async () => {
    const user = userEvent.setup();

    vi.mocked(UserService.getCompleteUser).mockResolvedValue({
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
      phone: "9876543210",
      role_id: 3,

      street_name: "",
      city: "",
      district: "",
      state: "",
      pincode: "",

      dob: "2000-01-01",
      blood_group: "O+",
    } as any);

    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const btn = await screen.findByRole("button", {
      name: /Edit Profile/i,
    });

    await user.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/patient-registration/edit/1"
    );
  });

  it("shows error when API fails", async () => {
    vi.mocked(UserService.getCompleteUser).mockRejectedValue(
      new Error("Failed to load profile")
    );

    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/Failed to load profile/i)
    ).toBeInTheDocument();
  });
});