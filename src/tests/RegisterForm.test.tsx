import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PatientRegistration from "../pages/patient/RegisterForm";
import * as UserService from "../services/UserService";
import * as Toast from "../utils/toast";
import authReducer from "../redux/authSlice";

vi.mock("../services/UserService", () => ({
  createCompleteUser: vi.fn(),
  getCompleteUser: vi.fn(),
  updateCompleteUser: vi.fn(),
}));

vi.mock("../utils/toast");

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("PatientRegistration Component", () => {
  const mockedUserService = vi.mocked(UserService);
  const mockedToast = vi.mocked(Toast);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate required fields on submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MemoryRouter>
        <PatientRegistration />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /save/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
    expect(mockedUserService.createCompleteUser).not.toHaveBeenCalled();
  });

  it("should call createCompleteUser on valid form submission", async () => {
    const user = userEvent.setup();
    mockedUserService.createCompleteUser.mockResolvedValue({});

    renderWithProviders(
      <MemoryRouter>
        <PatientRegistration />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/First Name/i), "John");
    await user.type(screen.getByLabelText(/Last Name/i), "Doe");
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/Phone/i), "1234567890");
    await user.type(screen.getByLabelText(/Password/i), "password123");
    await user.type(screen.getByLabelText(/Street Name/i), "Main St");
    await user.type(screen.getByLabelText(/City/i), "Cityville");
    await user.type(screen.getByLabelText(/District/i), "District");
    await user.type(screen.getByLabelText(/State/i), "State");
    await user.type(screen.getByLabelText(/Pincode/i), "123456");
    await user.type(screen.getByLabelText(/Date Of Birth/i), "1990-01-01");
    await user.type(screen.getByLabelText(/Blood Group/i), "O+");

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockedUserService.createCompleteUser).toHaveBeenCalled();
      expect(mockedToast.showSuccess).toHaveBeenCalledWith("User added successfully");
    });
  });

  it("should load user data when in edit mode", async () => {
    const mockUser = {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      phone: "9876543210",
      street_name: "Secondary St",
      city: "Townsville",
      district: "District",
      state: "State",
      pincode: "654321",
      dob: "1995-05-05T00:00:00Z",
      blood_group: "A+",
      role_id: 3,
    };

    mockedUserService.getCompleteUser.mockResolvedValue(mockUser as any);

    renderWithProviders(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<PatientRegistration />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
      expect(screen.getByDisplayValue("jane@example.com")).toBeInTheDocument();
    });
  });
});