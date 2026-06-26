import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminNurses from "../pages/admin/AdminNurse";
import { getAllNurses, removeNurse } from "../services/NurseService";
import { getAllUsers } from "../services/UserService";
import { getAllDepartments } from "../services/DepartmentService";

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

vi.mock("../components/SearchInput", () => ({
  default: ({ value, onChange }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("../components/DeleteModal", () => ({
  default: ({ open, onConfirm, onCancel }: any) =>
    open ? (
      <div data-testid="delete-modal">
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onCancel}>Cancel Delete</button>
      </div>
    ) : null,
}));

vi.mock("../services/NurseService", () => ({
  getAllNurses: vi.fn(),
  removeNurse: vi.fn(),
}));

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
}));

describe("AdminNurses", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (getAllNurses as any).mockResolvedValue([
      { user_id: 1, salary: 40000, department_id: 1 },
    ]);

    (getAllUsers as any).mockResolvedValue([
      { id: 1, first_name: "Jane", last_name: "Doe" },
    ]);

    (getAllDepartments as any).mockResolvedValue([
      { id: 1, department_name: "ICU" },
    ]);
  });

  function renderComponent() {
    return render(
      <BrowserRouter>
        <AdminNurses />
      </BrowserRouter>
    );
  }

  it("renders loading initially", () => {
    renderComponent();
    expect(screen.getByText("Loading nurses...")).toBeInTheDocument();
  });

  it("renders nurses after fetch", async () => {
    renderComponent();
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
  });

  it("navigates to add nurse page", async () => {
    renderComponent();
    await screen.findByText("Jane Doe");
    fireEvent.click(screen.getByText("Add nurse"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin-users/add");
  });

  it("navigates to edit nurse page", async () => {
    renderComponent();
    await screen.findByText("Jane Doe");
    fireEvent.click(screen.getByText("Edit"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin-users/edit/1");
  });

  it("filters nurses using search", async () => {
    renderComponent();
    await screen.findByText("Jane Doe");

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "xyz" },
    });

    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
  });

  it("opens and closes delete modal", async () => {
    renderComponent();
    await screen.findByText("Jane Doe");

    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel Delete"));
    await waitFor(() => {
      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
    });
  });

  it("deletes nurse successfully", async () => {
    (removeNurse as any).mockResolvedValue(undefined);
    renderComponent();

    await screen.findByText("Jane Doe");
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(removeNurse).toHaveBeenCalledWith(1);
    });
  });

  it("shows error when fetch fails", async () => {
    (getAllNurses as any).mockRejectedValue(new Error("Fetch failed"));
    renderComponent();
    expect(await screen.findByText("Fetch failed")).toBeInTheDocument();
  });

  it("handles delete failure", async () => {
    (removeNurse as any).mockRejectedValue(new Error("Delete failed"));
    renderComponent();

    await screen.findByText("Jane Doe");
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
  });
});