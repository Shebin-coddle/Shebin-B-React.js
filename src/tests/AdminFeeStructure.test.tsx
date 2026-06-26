import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminFees from "../pages/admin/AdminFeeStructure";
import * as FeeService from "../services/FeeService";

const mockNavigate = vi.fn();
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
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/FeeService", () => ({
  getAllFees: vi.fn(),
  removeFee: vi.fn(),
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
        <button onClick={onCancel}>Cancel Delete</button>
      </div>
    ) : null,
}));

const fees = [
  {
    id: 1,
    fee_name: "Consultation",
    amount: 500,
  },
  {
    id: 2,
    fee_name: "X-Ray",
    amount: 1000,
  },
];

const renderComponent = () =>
  render(
    <BrowserRouter>
      <AdminFees />
    </BrowserRouter>,
  );

describe("AdminFees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    vi.mocked(FeeService.getAllFees).mockImplementation(
      () => new Promise(() => {}),
    );

    renderComponent();

    expect(
      screen.getByText("Loading fee structures..."),
    ).toBeInTheDocument();
  });

  it("renders fees successfully", async () => {
    vi.mocked(FeeService.getAllFees).mockResolvedValue(fees as any);

    renderComponent();

    expect(await screen.findByText("Consultation")).toBeInTheDocument();
    expect(screen.getByText("X-Ray")).toBeInTheDocument();
    expect(screen.getByText("₹500")).toBeInTheDocument();
    expect(screen.getByText("₹1000")).toBeInTheDocument();
  });

  it("handles fetch error", async () => {
    vi.mocked(FeeService.getAllFees).mockRejectedValue(
      new Error("Fetch failed"),
    );

    renderComponent();

    expect(await screen.findByText("Fetch failed")).toBeInTheDocument();
  });

  it("handles non error fetch failure", async () => {
    vi.mocked(FeeService.getAllFees).mockRejectedValue("error");

    renderComponent();

    expect(
      await screen.findByText("Failed to fetch fee structures"),
    ).toBeInTheDocument();
  });

  it("navigates to add fee page", async () => {
    vi.mocked(FeeService.getAllFees).mockResolvedValue(fees as any);

    renderComponent();

    await screen.findByText("Consultation");

    fireEvent.click(screen.getByText("Add Fees"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-fees/add");
  });

  it("navigates to edit fee page", async () => {
    vi.mocked(FeeService.getAllFees).mockResolvedValue(fees as any);

    renderComponent();

    await screen.findByText("Consultation");

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/admin-fees/edit/1");
  });

  it("opens and closes delete modal", async () => {
    vi.mocked(FeeService.getAllFees).mockResolvedValue(fees as any);

    renderComponent();

    await screen.findByText("Consultation");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel Delete"));

    expect(screen.queryByText("Confirm Delete")).not.toBeInTheDocument();
  });

  it("deletes fee successfully", async () => {
    vi.mocked(FeeService.getAllFees).mockResolvedValue(fees as any);
    vi.mocked(FeeService.removeFee).mockResolvedValue(undefined as any);

    renderComponent();

    await screen.findByText("Consultation");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(FeeService.removeFee).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("Consultation")).not.toBeInTheDocument();
    });
  });

  it("handles delete error", async () => {
    vi.mocked(FeeService.getAllFees).mockResolvedValue(fees as any);
    vi.mocked(FeeService.removeFee).mockRejectedValue(
      new Error("Delete failed"),
    );

    renderComponent();

    await screen.findByText("Consultation");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
  });

  it("handles delete non error object", async () => {
    vi.mocked(FeeService.getAllFees).mockResolvedValue(fees as any);
    vi.mocked(FeeService.removeFee).mockRejectedValue("error");

    renderComponent();

    await screen.findByText("Consultation");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
  });

  it("covers confirmDelete early return", async () => {
    vi.mocked(FeeService.getAllFees).mockResolvedValue(fees as any);

    renderComponent();

    await screen.findByText("Consultation");

    expect(FeeService.removeFee).not.toHaveBeenCalled();
  });
});