import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import EditForm from "../components/EditForm";

test("renders edit form and submits", () => {
  const handleChange = vi.fn();
  const handleSubmit = vi.fn((e) => e.preventDefault());
  const handleCancel = vi.fn();

  render(
    <EditForm
      title="Edit Doctor"
      fields={[
        {
          name: "specialization",
          label: "Specialization",
          type: "text",
          value: "Cardiology",
        },
        {
          name: "salary",
          label: "Salary",
          type: "number",
          value: 50000,
        },
      ]}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />,
  );

  expect(screen.getByText("Edit Doctor")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Cardiology")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Update"));
  expect(handleSubmit).toHaveBeenCalled();

  fireEvent.click(screen.getByText("Cancel"));
  expect(handleCancel).toHaveBeenCalled();
});