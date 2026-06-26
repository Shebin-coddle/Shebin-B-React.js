import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchInput from "../components/SearchInput";

describe("SearchInput Component", () => {
  it("should render with the correct placeholder and initial value", () => {
    render(
      <SearchInput 
        value="Initial Query" 
        placeholder="Search here..." 
        onChange={vi.fn()} 
      />
    );

    const inputElement = screen.getByPlaceholderText("Search here...") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe("Initial Query");
  });

  it("should trigger the onChange callback function when input changes", () => {
    const mockOnChange = vi.fn();
    render(
      <SearchInput 
        value="" 
        placeholder="Search..." 
        onChange={mockOnChange} 
      />
    );

    const inputElement = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    
    fireEvent.change(inputElement, { target: { value: "Testing" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("Testing");
  });
});