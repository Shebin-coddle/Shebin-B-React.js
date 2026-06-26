import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DateSearch from "../components/DateSearch";

describe("DateSearch", () => {
  const mockOnDateChange = vi.fn();
  const mockOnClear = vi.fn();

  it("renders input and button", () => {
    render(
      <DateSearch
        selectedDate="2026-06-26"
        onDateChange={mockOnDateChange}
        onClear={mockOnClear}
      />
    );
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByText(/clear filters/i)).toBeInTheDocument();
  });

  it("calls onDateChange when input value changes", () => {
    render(
      <DateSearch
        selectedDate=""
        onDateChange={mockOnDateChange}
        onClear={mockOnClear}
      />
    );
    const input = screen.getByLabelText(/date/i);
    fireEvent.change(input, { target: { value: "2026-07-01" } });
    expect(mockOnDateChange).toHaveBeenCalledWith("2026-07-01");
  });

  it("calls onClear when button is clicked", () => {
    render(
      <DateSearch
        selectedDate="2026-06-26"
        onDateChange={mockOnDateChange}
        onClear={mockOnClear}
      />
    );
    fireEvent.click(screen.getByText(/clear filters/i));
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });
});