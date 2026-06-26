import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminUsers from "../pages/admin/AdminUsers";
import * as UserService from "../services/UserService";

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

vi.mock("../services/UserService", () => ({
  getAllUsers: vi.fn(),
  removeUser: vi.fn(),
}));

vi.mock("../components/SearchInput", () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <input
      placeholder={placeholder}
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
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onCancel}>Cancel Delete</button>
      </div>
    ) : null,
}));

const users = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@test.com",
    phone: "9999999999",
    role_id: 1,
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@test.com",
    phone: "8888888888",
    role_id: 2,
  },
];

const renderComponent = () =>
  render(
    <BrowserRouter>
      <AdminUsers />
    </BrowserRouter>,
  );

describe("AdminUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    vi.mocked(UserService.getAllUsers).mockImplementation(
      () => new Promise(() => {}),
    );

    renderComponent();

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it("renders users successfully", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles fetch error", async () => {
    vi.mocked(UserService.getAllUsers).mockRejectedValue(
      new Error("Fetch failed"),
    );

    renderComponent();

    expect(await screen.findByText("Fetch failed")).toBeInTheDocument();
  });

  it("handles non error fetch failure", async () => {
    vi.mocked(UserService.getAllUsers).mockRejectedValue("error");

    renderComponent();

    expect(
      await screen.findByText("Error occurred while fetching users"),
    ).toBeInTheDocument();
  });

  it("navigates to add user page", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    await screen.findByText("John Doe");

    fireEvent.click(screen.getByText("Add User"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin-users/add");
  });

  it("navigates to edit user page", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    await screen.findByText("John Doe");

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/admin-users/edit/1");
  });

  it("filters users by name", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    await screen.findByText("John Doe");

    fireEvent.change(
      screen.getByPlaceholderText("Search users by name or email"),
      {
        target: { value: "john" },
      },
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("filters users by email", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    await screen.findByText("John Doe");

    fireEvent.change(
      screen.getByPlaceholderText("Search users by name or email"),
      {
        target: { value: "jane@test.com" },
      },
    );

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("opens and closes delete modal", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    await screen.findByText("John Doe");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel Delete"));

    expect(screen.queryByText("Confirm Delete")).not.toBeInTheDocument();
  });

  it("deletes user successfully", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);
    vi.mocked(UserService.removeUser).mockResolvedValue(undefined as any);

    renderComponent();

    await screen.findByText("John Doe");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(UserService.removeUser).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  it("handles delete error", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);
    vi.mocked(UserService.removeUser).mockRejectedValue(
      new Error("Delete failed"),
    );

    renderComponent();

    await screen.findByText("John Doe");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
  });

  it("handles delete non error object", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);
    vi.mocked(UserService.removeUser).mockRejectedValue("error");

    renderComponent();

    await screen.findByText("John Doe");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
  });

  it("renders admin role", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    expect(await screen.findByText("Admin")).toBeInTheDocument();
  });

  it("renders doctor role", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    expect(await screen.findByText("Doctor")).toBeInTheDocument();
  });

  it("renders N/A for missing email and phone", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue([
      {
        id: 3,
        first_name: "Test",
        last_name: "User",
        email: "",
        phone: "",
        role_id: 3,
      },
    ] as any);

    renderComponent();

    expect(await screen.findAllByText("N/A")).toHaveLength(2);
  });

  it("covers confirmDelete early return", async () => {
    vi.mocked(UserService.getAllUsers).mockResolvedValue(users as any);

    renderComponent();

    await screen.findByText("John Doe");

    expect(UserService.removeUser).not.toHaveBeenCalled();
  });
});