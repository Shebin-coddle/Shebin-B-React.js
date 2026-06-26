import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import AdminMedicines from "../pages/admin/AdminMedicine";
import * as MedicineService from "../services/MedicineService";

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
  getAllMedicines: vi.fn(),
  removeMedicine: vi.fn(),
}));

vi.mock("../components/SearchInput", () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("../components/DeleteModal", () => ({
  default: ({
    open,
    onConfirm,
    onCancel,
  }: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }) =>
    open ? (
      <div>
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

vi.mock("../components/table/DataTable", () => ({
  default: ({
    columns,
    data,
  }: {
    columns: any[];
    data: any[];
  }) => (
    <table>
      <tbody>
        {data.map((row: any) => (
          <tr key={row.id}>
            {columns.map((col: any, index: number) => (
              <td key={index}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe("AdminMedicines", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(MedicineService.getAllMedicines).mockResolvedValue([
      {
        id: 1,
        medicine_name: "Paracetamol",
        stock: 100,
        expiry_date: "2027-12-31",
      },
    ] as any);
  });

  it("shows loading state", () => {
    vi.mocked(MedicineService.getAllMedicines).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <AdminMedicines />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading medicines/i)).toBeInTheDocument();
  });

  it("renders medicines", async () => {
    render(
      <MemoryRouter>
        <AdminMedicines />
      </MemoryRouter>
    );

    expect(await screen.findByText("Paracetamol")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("navigates to add medicine page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminMedicines />
      </MemoryRouter>
    );

    await screen.findByText("Paracetamol");

    await user.click(
      screen.getByRole("button", { name: /Add medicine/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/admin-medicines/add");
  });

  it("navigates to edit medicine page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminMedicines />
      </MemoryRouter>
    );

    await screen.findByText("Paracetamol");

    await user.click(screen.getByRole("button", { name: /Edit/i }));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/admin-medicines/edit/1"
    );
  });

  it("deletes a medicine", async () => {
    const user = userEvent.setup();

    vi.mocked(MedicineService.removeMedicine).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AdminMedicines />
      </MemoryRouter>
    );

    await screen.findByText("Paracetamol");

    await user.click(screen.getByRole("button", { name: /Delete/i }));

    await user.click(
      screen.getByRole("button", { name: /Confirm Delete/i })
    );

    await waitFor(() => {
      expect(MedicineService.removeMedicine).toHaveBeenCalledWith(1);
    });
  });

  it("filters medicines by search", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminMedicines />
      </MemoryRouter>
    );

    await screen.findByText("Paracetamol");

    const search = screen.getByPlaceholderText(
      /Search medicine by name/i
    );

    await user.type(search, "Para");

    expect(screen.getByDisplayValue("Para")).toBeInTheDocument();
    expect(screen.getByText("Paracetamol")).toBeInTheDocument();
  });

  it("shows error when fetching medicines fails", async () => {
    vi.mocked(MedicineService.getAllMedicines).mockRejectedValue(
      new Error("Failed to fetch medicines")
    );

    render(
      <MemoryRouter>
        <AdminMedicines />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Failed to fetch medicines")
    ).toBeInTheDocument();
  });
});