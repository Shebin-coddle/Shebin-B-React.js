import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import FeeForm from "../pages/admin/FeeStructureForm";
import * as FeeService from "../services/FeeService";
import * as Toast from "../utils/toast";

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

vi.mock("../services/FeeService", () => ({
  createFee: vi.fn(),
  updateFee: vi.fn(),
  getFeeById: vi.fn(),
}));

vi.mock("../utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

describe("FeeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders add fee form", () => {
    render(
      <MemoryRouter>
        <FeeForm />
      </MemoryRouter>
    );

    expect(screen.getByText("Add Fee")).toBeInTheDocument();
    expect(screen.getByLabelText(/Fee Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
  });

  it("shows validation errors", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <FeeForm />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(
      await screen.findByText("Fee name is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Amount must be greater than 0")
    ).toBeInTheDocument();

    expect(FeeService.createFee).not.toHaveBeenCalled();
  });

  it("creates a fee", async () => {
    const user = userEvent.setup();

    vi.mocked(FeeService.createFee).mockResolvedValue({} as never);

    render(
      <MemoryRouter>
        <FeeForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/Fee Name/i),
      "Consultation"
    );

    await user.clear(screen.getByLabelText(/Amount/i));
    await user.type(screen.getByLabelText(/Amount/i), "500");

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(FeeService.createFee).toHaveBeenCalledWith({
        fee_name: "Consultation",
        amount: 500,
      });

      expect(Toast.showSuccess).toHaveBeenCalledWith(
        "Fee created successfully"
      );

      expect(mockNavigate).toHaveBeenCalledWith("/admin-fees");
    });
  });

  it("loads fee in edit mode", async () => {
    vi.mocked(FeeService.getFeeById).mockResolvedValue({
      fee_name: "Lab Test",
      amount: 750,
    } as never);

    render(
      <MemoryRouter initialEntries={["/admin-fees/edit/1"]}>
        <Routes>
          <Route path="/admin-fees/edit/:id" element={<FeeForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByDisplayValue("Lab Test")).toBeInTheDocument();

    expect(screen.getByDisplayValue("750")).toBeInTheDocument();
  });

  it("updates fee", async () => {
    const user = userEvent.setup();

    vi.mocked(FeeService.getFeeById).mockResolvedValue({
      fee_name: "Lab Test",
      amount: 750,
    } as never);

    vi.mocked(FeeService.updateFee).mockResolvedValue({} as never);

    render(
      <MemoryRouter initialEntries={["/admin-fees/edit/1"]}>
        <Routes>
          <Route path="/admin-fees/edit/:id" element={<FeeForm />} />
        </Routes>
      </MemoryRouter>
    );

    const feeName = await screen.findByLabelText(/Fee Name/i);

    await user.clear(feeName);
    await user.type(feeName, "MRI Scan");

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(FeeService.updateFee).toHaveBeenCalledWith(1, {
        fee_name: "MRI Scan",
        amount: 750,
      });

      expect(Toast.showSuccess).toHaveBeenCalledWith(
        "Fee updated successfully"
      );

      expect(mockNavigate).toHaveBeenCalledWith("/admin-fees");
    });
  });
});