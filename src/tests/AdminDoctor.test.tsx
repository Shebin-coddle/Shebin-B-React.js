import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminDoctors from "../pages/admin/AdminDoctor";

const mockNavigate = vi.fn();


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
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../src/services/DoctorService", () => ({
  getAllDoctors: vi.fn(),
  removeDoctor: vi.fn(),
}));

vi.mock("../../src/services/UserService", () => ({
  getAllUsers: vi.fn(),
}));

vi.mock("../../src/services/DepartmentService", () => ({
  getAllDepartments: vi.fn(),
}));

vi.mock("../components/SearchInput", () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
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
        <p>Delete Doctor</p>
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onCancel}>Cancel Delete</button>
      </div>
    ) : null,
}));

import {
  getAllDoctors,
  removeDoctor,
} from "../../src/services/DoctorService";
import { getAllUsers } from "../../src/services/UserService";
import { getAllDepartments } from "../../src/services/DepartmentService";

describe("AdminDoctors", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (getAllDoctors as any).mockResolvedValue([
      {
        user_id: 1,
        department_id: 1,
        specialization: "Cardiology",
        salary: 50000,
      },
    ]);

    (getAllUsers as any).mockResolvedValue([
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
      },
    ]);

    (getAllDepartments as any).mockResolvedValue([
      {
        id: 1,
        department_name: "Cardiology",
      },
    ]);
  });

  function renderComponent() {
    return render(
      <BrowserRouter>
        <AdminDoctors />
      </BrowserRouter>,
    );
  }

  it("renders doctors page", async () => {
    renderComponent();

    expect(await screen.findByText("Doctors")).toBeInTheDocument();
    expect(await screen.findByText("Dr.John Doe")).toBeInTheDocument();
  });

  it("filters doctors using search", async () => {
    renderComponent();

    await screen.findByText("Dr.John Doe");

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "abc" },
    });

    expect(screen.queryByText("Dr.John Doe")).not.toBeInTheDocument();
  });

  it("navigates to add doctor page", async () => {
    renderComponent();

    await screen.findByText("Doctors");

    fireEvent.click(screen.getByText("Add doctor"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-users/add");
  });

  it("navigates to edit doctor page", async () => {
    renderComponent();

    const editButton = await screen.findByText("Edit");

    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/admin-users/edit/1");
  });

  it("opens delete modal", async () => {
    renderComponent();

    const deleteButton = await screen.findByText("Delete");

    fireEvent.click(deleteButton);

    expect(screen.getByText("Delete Doctor")).toBeInTheDocument();
  });

  it("closes delete modal on cancel", async () => {
    renderComponent();

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Cancel Delete"));

    await waitFor(() => {
      expect(screen.queryByText("Delete Doctor")).not.toBeInTheDocument();
    });
  });

  it("deletes doctor successfully", async () => {
    (removeDoctor as any).mockResolvedValue(undefined);

    renderComponent();

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(removeDoctor).toHaveBeenCalledWith(1);
    });
  });

  it("shows error when delete fails", async () => {
    (removeDoctor as any).mockRejectedValue(new Error("Delete failed"));

    renderComponent();

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(
      await screen.findByText("Delete failed"),
    ).toBeInTheDocument();
  });

  it("shows doctor fetch error", async () => {
    (getAllDoctors as any).mockRejectedValue(
      new Error("Failed to fetch doctors"),
    );

    renderComponent();

    expect(
      await screen.findByText("Failed to fetch doctors"),
    ).toBeInTheDocument();
  });

  it("handles users fetch failure", async () => {
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (getAllUsers as any).mockRejectedValue(new Error("users error"));

    renderComponent();

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });

  it("handles departments fetch failure", async () => {
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (getAllDepartments as any).mockRejectedValue(
      new Error("department error"),
    );

    renderComponent();

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });
});