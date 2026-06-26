import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DetailCard from "../components/DetailsView";

describe("DetailCard Component", () => {
  it("should render the title and map details array correctly", () => {
    const sampleDetails = [
      { label: "Name", value: "John Doe" },
      { label: "Age", value: 30 },
    ];

    render(
      <DetailCard 
        title="Profile Details" 
        details={sampleDetails} 
        onClose={vi.fn()} 
      />
    );

    expect(screen.getByText("Profile Details")).toBeInTheDocument();
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Age:")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("should render N/A when values are empty, null, or undefined", () => {
    const missingDetails = [
      { label: "Phone", value: "" },
      { label: "Address", value: null },
      { label: "Email", value: undefined },
    ];

    render(
      <DetailCard 
        title="Contact Info" 
        details={missingDetails} 
        onClose={vi.fn()} 
      />
    );

    const naElements = screen.getAllByText("N/A");
    expect(naElements).toHaveLength(3);
  });

  it("should invoke onClose when the Close button is clicked", () => {
    const mockOnClose = vi.fn();
    const sampleDetails = [{ label: "Status", value: "Active" }];

    render(
      <DetailCard 
        title="Status View" 
        details={sampleDetails} 
        onClose={mockOnClose} 
      />
    );

    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});