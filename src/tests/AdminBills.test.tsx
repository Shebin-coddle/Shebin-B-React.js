import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import AdminBills from "../pages/admin/AdminBills";
import * as BillService from "../services/BillService";

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

vi.mock("../components/table/DataTable", () => ({
  default: ({ columns, data }: any) => (
    <table>
      <tbody>
        {data.map((row: any) => (
          <tr key={row.id ?? JSON.stringify(row)}>
            {columns.map((column: any) => (
              <td key={column.header}>
                {column.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

vi.mock("../services/BillService", () => ({
  getAllBills: vi.fn(),
  removeBill: vi.fn(),
}));

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn().mockResolvedValue([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
    },
  ]),
}));

vi.mock("../services/FeeService", () => ({
  getAllFees: vi.fn().mockResolvedValue([
    {
      id: 1,
      fee_name: "Consultation",
    },
  ]),
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



describe("AdminBills", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(BillService.getAllBills).mockResolvedValue([
      {
        id: 1,
        patient_id: 1,
        fee_id: 1,
        amount: 500,
        date: "2026-06-26",
        status: "completed",
        mode_of_payment: "cash",
        receipt_link: "/receipt.pdf",
      },
    ] as any);
  });

  it("shows loading initially", () => {
    vi.mocked(BillService.getAllBills).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <AdminBills />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading bills/i)).toBeInTheDocument();
  });

  it("renders bills after loading", async () => {
    render(
      <MemoryRouter>
        <AdminBills />
      </MemoryRouter>
    );

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Consultation")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("cash")).toBeInTheDocument();
  });

  it("navigates to add bill page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminBills />
      </MemoryRouter>
    );

    await screen.findByText("John Doe");

    await user.click(screen.getByRole("button", { name: /Add Bill/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-bills/add");
  });

  it("navigates to edit bill page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminBills />
      </MemoryRouter>
    );

    await screen.findByText("John Doe");

    await user.click(screen.getByRole("button", { name: /Edit/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-bills/edit/1");
  });

  it("deletes a bill", async () => {
    const user = userEvent.setup();

    vi.mocked(BillService.removeBill).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AdminBills />
      </MemoryRouter>
    );

    await screen.findByText("John Doe");

    await user.click(screen.getByRole("button", { name: /Delete/i }));

    await user.click(
      screen.getByRole("button", { name: /Confirm Delete/i })
    );

    await waitFor(() => {
      expect(BillService.removeBill).toHaveBeenCalledWith(1);
    });
  });

  it("filters by patient name", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminBills />
      </MemoryRouter>
    );

    await screen.findByText("John Doe");

    const search = screen.getByPlaceholderText(/Search by patient name/i);

    await user.type(search, "John");

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("clears filters", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminBills />
      </MemoryRouter>
    );

    await screen.findByText("John Doe");

    const search = screen.getByPlaceholderText(/Search by patient name/i);

    await user.type(search, "John");

    expect(search).toHaveValue("John");

    await user.click(
      screen.getByRole("button", { name: /Clear Filters/i })
    );

    expect(search).toHaveValue("");
  });
});