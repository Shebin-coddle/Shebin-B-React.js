import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PatientBills from "../pages/patient/PatientBills";

import { getAllBills, payBill } from "../services/BillService";
import { showSuccess, showError } from "../utils/toast";

vi.mock("../services/BillService", () => ({
  getAllBills: vi.fn(),
  payBill: vi.fn(),
}));

vi.mock("../utils/toast", () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

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

vi.mock("../components/DateSearch", () => ({
  default: ({ selectedDate, onDateChange, onClear }: any) => (
    <>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
      <button onClick={onClear}>Clear</button>
    </>
  ),
}));



describe("PatientBills", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("user_id", "1");

    vi.stubGlobal("open", vi.fn());

    vi.mocked(getAllBills).mockResolvedValue([
      {
        id: 1,
        patient_id: 1,
        amount: 1000,
        date: "2026-01-01",
        description: "Consultation",
        status: "pending",
        mode_of_payment: null,
        receipt_link: null,
      },
      {
        id: 2,
        patient_id: 2,
        amount: 2000,
        date: "2026-01-02",
        description: "Lab Test",
        status: "completed",
        mode_of_payment: "upi",
        receipt_link: "/receipt.pdf",
      },
    ] as any);
  });

  it("renders patient bills", async () => {
    render(<PatientBills />);

    expect(await screen.findByText("My Bills")).toBeInTheDocument();

    expect(screen.getByText("Consultation")).toBeInTheDocument();
    expect(screen.queryByText("Lab Test")).not.toBeInTheDocument();
  });

  it("filters bills by date", async () => {
    render(<PatientBills />);

    await screen.findByText("Consultation");

   const dateInput = document.querySelector("input[type='date']") as HTMLInputElement;

fireEvent.change(dateInput, {
  target: { value: "2026-01-01" },
});

    expect(screen.getByText("Consultation")).toBeInTheDocument();
  });

  it("opens payment modal", async () => {
    render(<PatientBills />);

    await screen.findByText("Consultation");

    await userEvent.click(screen.getByRole("button", { name: /pay bill/i }));

    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("pays bill successfully", async () => {
    vi.mocked(payBill).mockResolvedValue({
      message: "Payment Successful",
      receiptLink: "/receipt.pdf",
    } as any);

    render(<PatientBills />);

    await screen.findByText("Consultation");

    await userEvent.click(screen.getByRole("button", { name: /pay bill/i }));

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "upi" },
    });

    await userEvent.click(
      screen.getByRole("button", {
        name: /confirm/i,
      }),
    );

    await waitFor(() => {
      expect(payBill).toHaveBeenCalledWith(1, "upi");
    });

    expect(showSuccess).toHaveBeenCalledWith("Payment Successful");
  });

  it("shows error on payment failure", async () => {
    vi.mocked(payBill).mockRejectedValue(new Error("Payment Failed"));

    render(<PatientBills />);

    await screen.findByText("Consultation");

    await userEvent.click(screen.getByRole("button", { name: /pay bill/i }));

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "upi" },
    });

    await userEvent.click(
      screen.getByRole("button", {
        name: /confirm/i,
      }),
    );

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith("Payment Failed");
    });
  });

  it("closes payment modal", async () => {
    render(<PatientBills />);

    await screen.findByText("Consultation");

    await userEvent.click(screen.getByRole("button", { name: /pay bill/i }));

    await userEvent.click(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    );

    expect(screen.queryByText("Payment")).not.toBeInTheDocument();
  });

  it("opens receipt", async () => {
    vi.mocked(getAllBills).mockResolvedValue([
      {
        id: 1,
        patient_id: 1,
        amount: 1000,
        date: "2026-01-01",
        description: "Consultation",
        status: "completed",
        mode_of_payment: "upi",
        receipt_link: "https://example.com/receipt.pdf",
      },
    ] as any);

    render(<PatientBills />);

    await screen.findByText("Consultation");

    await userEvent.click(
      screen.getByRole("button", {
        name: /view receipt/i,
      }),
    );

    expect(window.open).toHaveBeenCalled();
  });

  it("shows fetch error", async () => {
    vi.mocked(getAllBills).mockRejectedValue(new Error("Server Error"));

    render(<PatientBills />);

    expect(await screen.findByText("Server Error")).toBeInTheDocument();
  });
});