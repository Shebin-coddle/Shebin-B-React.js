import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditForm from "../components/EditForm";
import type { EditField } from "../components/EditForm";
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EditForm Component", () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn((e) => e.preventDefault());
  const mockOnCancel = vi.fn();

  const baseFields: EditField[] = [
    { name: "personal_section", label: "Personal Information", type: "section" },
    { name: "username", label: "Username", type: "text", value: "johndoe" },
    { name: "bio", label: "Biography", type: "textarea", value: "Some details" },
    {
      name: "role",
      label: "Role",
      type: "select",
      value: "user",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Guest", value: "guest", disabled: true },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render sections, text inputs, textareas, and selection dropdown menus correctly", () => {
    render(
      <MemoryRouter>
        <EditForm
          title="Create Profile"
          fields={baseFields}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2, name: "Create Profile" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Personal Information" })).toBeInTheDocument();

    const textInput = screen.getByLabelText("Username :");
    expect(textInput).toBeInTheDocument();
    expect(textInput).toHaveValue("johndoe");

    const textArea = screen.getByLabelText("Biography :");
    expect(textArea).toBeInTheDocument();
    expect(textArea).toHaveValue("Some details");

    const selectMenu = screen.getByLabelText("Role :");
    expect(selectMenu).toBeInTheDocument();
    expect(selectMenu).toHaveValue("user");
    expect(screen.getByRole("option", { name: "Guest" })).toBeDisabled();
  });

  it("should intercept event modifications and bubble changes cleanly", () => {
    render(
      <MemoryRouter>
        <EditForm
          title="Update Profile"
          fields={[baseFields[1]]}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    const input = screen.getByLabelText("Username :");
    fireEvent.change(input, { target: { value: "updatedjohndoe" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("should fire form dispatch and cancel routines appropriately when action indicators are triggered", () => {
    render(
      <MemoryRouter>
        <EditForm
          title="Form Actions"
          fields={[]}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole("button", { name: "Save" }));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should append inline verification messages to structural fields containing active validation flags", () => {
    const mockErrors = { username: "Username is already in use" };

    render(
      <MemoryRouter>
        <EditForm
          title="Errors Display"
          fields={[baseFields[1]]}
          errors={mockErrors}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Username is already in use")).toBeInTheDocument();
  });

  it("should present the custom client append block when conditional field targets match edit workflows", () => {
    const patientFields: EditField[] = [
      { name: "patient_id", label: "Patient Record ID", type: "text", value: "P-101" },
    ];

    render(
      <MemoryRouter>
        <EditForm
          title="Edit Patient Workflow"
          fields={patientFields}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          mode="edit"
        />
      </MemoryRouter>
    );

    const appendBtn = screen.getByRole("button", { name: "Add new patient" });
    expect(appendBtn).toBeInTheDocument();

    fireEvent.click(appendBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/admin-users/add");
  });
});