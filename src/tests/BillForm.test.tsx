import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import BillForm from "../pages/admin/BillForm";
import * as BillService from "../services/BillService";
import * as Toast from "../utils/toast";

vi.mock("../services/BillService", () => ({
  createBill: vi.fn(),
  updateBill: vi.fn(),
  getBillById: vi.fn(),
}));

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn().mockResolvedValue([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      role_id: 3,
    },
  ]),
}));

vi.mock("../services/FeeService", () => ({
  getAllFees: vi.fn().mockResolvedValue([
    {
      id: 1,
      fee_name: "Consultation",
      amount: 500,
    },
  ]),
}));

vi.mock("../utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

describe("BillForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate required fields on submit", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <BillForm />
      </MemoryRouter>
    );

    await screen.findByLabelText(/Patient/i);

    await user.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(
      await screen.findByText(/Patient is required/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Fee type is required/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Amount must be greater than 0/i)
    ).toBeInTheDocument();
  });

  it("should submit the form with valid data", async () => {
    const user = userEvent.setup();

    vi.mocked(BillService.createBill).mockResolvedValue({} as never);

    render(
      <MemoryRouter>
        <BillForm />
      </MemoryRouter>
    );

    await user.selectOptions(
      await screen.findByLabelText(/Patient/i),
      "1"
    );

    await user.selectOptions(
      screen.getByLabelText(/Fee Type/i),
      "1"
    );

    await user.selectOptions(
      screen.getByLabelText(/Status/i),
      "pending"
    );

    await user.selectOptions(
      screen.getByLabelText(/Mode of Payment/i),
      "cash"
    );

    await user.type(
      screen.getByLabelText(/Date/i),
      "2026-06-26"
    );

    await user.type(
      screen.getByLabelText(/Description/i),
      "Consultation fee"
    );

    await user.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    await waitFor(() => {
      expect(BillService.createBill).toHaveBeenCalledTimes(1);

      expect(Toast.showSuccess).toHaveBeenCalledWith(
        "Bill created"
      );
    });
  });
});