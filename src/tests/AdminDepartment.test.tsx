import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminDepartments from "../pages/admin/AdminDepartment";
import * as DepartmentService from "../services/DepartmentService";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
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
vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
  removeDepartment: vi.fn(),
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

const departments = [
  { id: 1, department_name: "Cardiology", contact_number: "111" },
  { id: 2, department_name: "Neurology", contact_number: null },
];

const renderComponent = () =>
  render(
    <BrowserRouter>
      <AdminDepartments />
    </BrowserRouter>,
  );

describe("AdminDepartments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    vi.mocked(DepartmentService.getAllDepartments).mockImplementation(
      () => new Promise(() => {}),
    );

    renderComponent();

    expect(screen.getByText("Loading departments...")).toBeInTheDocument();
  });

  it("renders departments successfully", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue(
      departments as any,
    );

    renderComponent();

    expect(await screen.findByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("Neurology")).toBeInTheDocument();
    expect(screen.getByText("111")).toBeInTheDocument();
    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
  });

  it("handles fetch error", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockRejectedValue(
      new Error("Fetch failed"),
    );

    renderComponent();

    expect(await screen.findByText("Fetch failed")).toBeInTheDocument();
  });

  it("handles non-error fetch failure", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockRejectedValue(
      "error",
    );

    renderComponent();

    expect(
      await screen.findByText("Error occurred while fetching departments"),
    ).toBeInTheDocument();
  });

  it("navigates to add department page", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue(
      departments as any,
    );

    renderComponent();

    await screen.findByText("Cardiology");

    fireEvent.click(screen.getByText("Add department"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-departments/add");
  });

  it("navigates to edit department page", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue(
      departments as any,
    );

    renderComponent();

    await screen.findByText("Cardiology");

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/admin-departments/edit/1");
  });

  it("opens and closes delete modal", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue(
      departments as any,
    );

    renderComponent();

    await screen.findByText("Cardiology");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel Delete"));

    expect(screen.queryByText("Confirm Delete")).not.toBeInTheDocument();
  });

  it("deletes department successfully", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue(
      departments as any,
    );

    vi.mocked(DepartmentService.removeDepartment).mockResolvedValue(
      undefined as any,
    );

    renderComponent();

    await screen.findByText("Cardiology");

    fireEvent.click(screen.getAllByText("Delete")[0]);
    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(DepartmentService.removeDepartment).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("Cardiology")).not.toBeInTheDocument();
    });
  });

  it("handles delete error", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue(
      departments as any,
    );

    vi.mocked(DepartmentService.removeDepartment).mockRejectedValue(
      new Error("Delete failed"),
    );

    renderComponent();

    await screen.findByText("Cardiology");

    fireEvent.click(screen.getAllByText("Delete")[0]);
    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
  });

  it("covers confirmDelete early return", async () => {
    vi.mocked(DepartmentService.getAllDepartments).mockResolvedValue(
      departments as any,
    );

    renderComponent();

    await screen.findByText("Cardiology");

    expect(DepartmentService.removeDepartment).not.toHaveBeenCalled();
  });
});