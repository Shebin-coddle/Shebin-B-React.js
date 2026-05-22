import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import DetailCard from "../components/DetailsView";

test("renders detail card data and closes", () => {
  const handleClose = vi.fn();

  render(
    <DetailCard
      title="User Details"
      details={[
        { label: "Name", value: "Shebin" },
        { label: "Email", value: null },
      ]}
      onClose={handleClose}
    />,
  );

  expect(screen.getByText("User Details")).toBeInTheDocument();
  expect(screen.getByText(/Name:/)).toBeInTheDocument();
  expect(screen.getByText("Shebin")).toBeInTheDocument();
  expect(screen.getByText("N/A")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  expect(handleClose).toHaveBeenCalled();
});