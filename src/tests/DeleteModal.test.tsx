import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "../components/DeleteModal";

describe("DeleteModal Component", () => {
  it("should return null and not render when open property is false", () => {
    const { container } = render(
      <DeleteModal open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render default text values when open property is true", () => {
    render(<DeleteModal open={true} onConfirm={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this item?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("should display custom title, message, and children when provided", () => {
    render(
      <DeleteModal 
        open={true} 
        onConfirm={vi.fn()} 
        onCancel={vi.fn()} 
        title="Remove Account"
        message="This is a permanent operation."
      >
        <span data-testid="custom-child">Extra Caution Node</span>
      </DeleteModal>
    );

    expect(screen.getByText("Remove Account")).toBeInTheDocument();
    expect(screen.getByText("This is a permanent operation.")).toBeInTheDocument();
    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
  });

  it("should execute onCancel when clicking the overlay container", () => {
    const mockOnCancel = vi.fn();
    const { container } = render(
      <DeleteModal open={true} onConfirm={vi.fn()} onCancel={mockOnCancel} />
    );

    const overlay = container.querySelector(".modal-overlay")!;
    fireEvent.click(overlay);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should prevent event propagation when clicking inside the modal content box", () => {
    const mockOnCancel = vi.fn();
    const { container } = render(
      <DeleteModal open={true} onConfirm={vi.fn()} onCancel={mockOnCancel} />
    );

    const modalBox = container.querySelector(".modal-box")!;
    fireEvent.click(modalBox);

    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it("should call onConfirm when clicking the delete button element", () => {
    const mockOnConfirm = vi.fn();
    render(<DeleteModal open={true} onConfirm={mockOnConfirm} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("should change UI state and lock action button interactions when loading is true", () => {
    render(
      <DeleteModal open={true} onConfirm={vi.fn()} onCancel={vi.fn()} loading={true} />
    );

    const deleteBtn = screen.getByRole("button", { name: "Deleting..." });
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });

    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });
});