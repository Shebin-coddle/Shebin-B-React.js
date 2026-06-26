import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DataTable from "../components/table/DataTable";

type User = { id: number; name: string };
const mockData: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
];

const columns = [
  { header: "ID", render: (item: User) => item.id },
  { header: "Name", render: (item: User) => item.name },
];

describe("DataTable", () => {
  it("renders headers", () => {
    render(<DataTable columns={columns} data={mockData} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("renders correct row count per page", () => {
    render(<DataTable columns={columns} data={mockData} rowsPerPage={2} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  it("navigates pages", () => {
    render(<DataTable columns={columns} data={mockData} rowsPerPage={2} />);
    
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("David")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Prev"));
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("disables boundary buttons", () => {
    render(<DataTable columns={columns} data={mockData} rowsPerPage={2} />);
    
    expect(screen.getByText("Prev")).toBeDisabled();
    
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("handles empty data", () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText("Page 1 of 0")).toBeInTheDocument();
  });
});