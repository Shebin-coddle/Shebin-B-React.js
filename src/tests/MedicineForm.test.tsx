import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import MedicineForm from "../pages/admin/MedicineForm";
import * as MedicineService from "../services/MedicineService";
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

vi.mock("../services/MedicineService", () => ({
  getMedicineById: vi.fn(),
  createMedicine: vi.fn(),
  updateMedicine: vi.fn(),
}));

vi.mock("../utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

describe("MedicineForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders add medicine form", () => {
    render(
      <MemoryRouter>
        <MedicineForm />
      </MemoryRouter>
    );

    expect(screen.getByText("Add Medicine")).toBeInTheDocument();
    expect(screen.getByLabelText(/Medicine Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiry Date/i)).toBeInTheDocument();
  });

  it("shows validation errors", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MedicineForm />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(
      await screen.findByText("Medicine name is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Description is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Expiry date is required")
    ).toBeInTheDocument();

    expect(MedicineService.createMedicine).not.toHaveBeenCalled();
  });

  it("creates a medicine", async () => {
    const user = userEvent.setup();

    vi.mocked(MedicineService.createMedicine).mockResolvedValue({} as never);

    render(
      <MemoryRouter>
        <MedicineForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/Medicine Name/i),
      "Paracetamol"
    );

    await user.type(
      screen.getByLabelText(/Description/i),
      "Pain killer"
    );

    await user.clear(screen.getByLabelText(/Stock/i));
    await user.type(screen.getByLabelText(/Stock/i), "100");

    const futureDate = "2030-12-31";

    await user.type(
      screen.getByLabelText(/Expiry Date/i),
      futureDate
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(MedicineService.createMedicine).toHaveBeenCalledWith({
        medicine_name: "Paracetamol",
        description: "Pain killer",
        stock: 100,
        expiry_date: futureDate,
      });

      expect(Toast.showSuccess).toHaveBeenCalledWith(
        "Medicine added successfully"
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        "/admin-medicines"
      );
    });
  });

  it("loads medicine in edit mode", async () => {
    vi.mocked(MedicineService.getMedicineById).mockResolvedValue([
      {
        medicine_name: "Amoxicillin",
        description: "Antibiotic",
        stock: 50,
        expiry_date: "2031-05-10T00:00:00.000Z",
      },
    ] as never);

    render(
      <MemoryRouter initialEntries={["/admin-medicines/edit/1"]}>
        <Routes>
          <Route
            path="/admin-medicines/edit/:id"
            element={<MedicineForm />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByDisplayValue("Amoxicillin")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Antibiotic")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("50")
    ).toBeInTheDocument();
  });

  it("updates a medicine", async () => {
    const user = userEvent.setup();

    vi.mocked(MedicineService.getMedicineById).mockResolvedValue([
      {
        medicine_name: "Amoxicillin",
        description: "Antibiotic",
        stock: 50,
        expiry_date: "2031-05-10T00:00:00.000Z",
      },
    ] as never);

    vi.mocked(MedicineService.updateMedicine).mockResolvedValue(
      {} as never
    );

    render(
      <MemoryRouter initialEntries={["/admin-medicines/edit/1"]}>
        <Routes>
          <Route
            path="/admin-medicines/edit/:id"
            element={<MedicineForm />}
          />
        </Routes>
      </MemoryRouter>
    );

    const medicineName = await screen.findByLabelText(
      /Medicine Name/i
    );

    await user.clear(medicineName);
    await user.type(medicineName, "Ibuprofen");

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(MedicineService.updateMedicine).toHaveBeenCalledWith(1, {
        medicine_name: "Ibuprofen",
        description: "Antibiotic",
        stock: 50,
        expiry_date: "2031-05-10",
      });

      expect(Toast.showSuccess).toHaveBeenCalledWith(
        "Details Updated"
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        "/admin-medicines"
      );
    });
  });

  it("shows validation for past expiry date", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MedicineForm />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/Medicine Name/i),
      "Paracetamol"
    );

    await user.type(
      screen.getByLabelText(/Description/i),
      "Pain killer"
    );

    await user.clear(screen.getByLabelText(/Stock/i));
    await user.type(screen.getByLabelText(/Stock/i), "10");

    await user.type(
      screen.getByLabelText(/Expiry Date/i),
      "2020-01-01"
    );

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(
      await screen.findByText("Expiry date cannot be in the past")
    ).toBeInTheDocument();

    expect(MedicineService.createMedicine).not.toHaveBeenCalled();
  });
});