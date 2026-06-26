import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import DepartmentForm from "../pages/admin/DepartmentForm";
import * as DepartmentService from "../services/DepartmentService";
import * as Toast from "../utils/toast";

vi.mock("../services/DepartmentService", () => ({
  createDepartment: vi.fn(),
  updateDepartment: vi.fn(),
  getDepartmentById: vi.fn(),
}));

vi.mock("../utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

describe("DepartmentForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate required fields on submit", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DepartmentForm />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(
      await screen.findByText(/Department name is required/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Contact number is required/i)
    ).toBeInTheDocument();

    expect(DepartmentService.createDepartment).not.toHaveBeenCalled();
  });

  it("should validate invalid contact number", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DepartmentForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/Department Name/i),
      "Cardiology"
    );

    await user.type(
      screen.getByLabelText(/Contact Number/i),
      "12345"
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(
      await screen.findByText(/Contact number must be 10 digits/i)
    ).toBeInTheDocument();

    expect(DepartmentService.createDepartment).not.toHaveBeenCalled();
  });

  it("should create department successfully", async () => {
    const user = userEvent.setup();

    vi.mocked(DepartmentService.createDepartment).mockResolvedValue(
      {} as never
    );

    render(
      <MemoryRouter>
        <DepartmentForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/Department Name/i),
      "Cardiology"
    );

    await user.type(
      screen.getByLabelText(/Contact Number/i),
      "9876543210"
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(DepartmentService.createDepartment).toHaveBeenCalledWith({
        department_name: "Cardiology",
        contact_number: "9876543210",
      });

      expect(Toast.showSuccess).toHaveBeenCalledWith(
        "Department added successfully"
      );
    });
  });

  it("should show error if create department fails", async () => {
    const user = userEvent.setup();

    vi.mocked(DepartmentService.createDepartment).mockRejectedValue(
      new Error("Failed")
    );

    render(
      <MemoryRouter>
        <DepartmentForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/Department Name/i),
      "Cardiology"
    );

    await user.type(
      screen.getByLabelText(/Contact Number/i),
      "9876543210"
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(Toast.showError).toHaveBeenCalledWith(
        "Operation Unsuccessfull"
      );
    });
  });
});