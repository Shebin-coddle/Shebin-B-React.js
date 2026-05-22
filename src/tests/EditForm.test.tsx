import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import EditForm from "../components/EditForm";

test("renders edit form fields and buttons", () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn((e) => e.preventDefault());
  const onCancel = vi.fn();

  render(
    <EditForm
      title="Edit User"
      fields={[
        {
          name: "first_name",
          label: "First Name",
          type: "text",
          value: "Shebin",
        },
        {
          name: "salary",
          label: "Salary",
          type: "number",
          value: 10000,
        },
        {
          name: "address",
          label: "Address",
          type: "textarea",
          value: "Kochi",
        },
        {
          name: "role",
          label: "Role",
          type: "select",
          value: "admin",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Patient", value: "patient" },
          ],
        },
      ]}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />,
  );

  expect(screen.getByText("Edit User")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Salary")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Address")).toBeInTheDocument();
expect(screen.getByRole("option", { name: "Admin" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});

test("calls change, submit and cancel handlers", () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn((e) => e.preventDefault());
  const onCancel = vi.fn();

  render(
    <EditForm
      title="Edit User"
      fields={[
        {
          name: "first_name",
          label: "First Name",
          type: "text",
          value: "",
        },
      ]}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />,
  );

  fireEvent.change(screen.getByPlaceholderText("First Name"), {
    target: { value: "Shebin" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(onChange).toHaveBeenCalled();
  expect(onSubmit).toHaveBeenCalled();
  expect(onCancel).toHaveBeenCalled();
});