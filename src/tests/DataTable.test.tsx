import { render, screen } from "@testing-library/react";
import DataTable from "../components/table/DataTable";

type User = {
  id: number;
  name: string;
};

test("renders table headers and rows", () => {
  const data: User[] = [
    { id: 1, name: "Shebin" },
    { id: 2, name: "Rahul" },
  ];

  const columns = [
    {
      header: "ID",
      render: (user: User) => user.id,
    },
    {
      header: "Name",
      render: (user: User) => user.name,
    },
  ];

  render(<DataTable columns={columns} data={data} />);

  expect(screen.getByText("ID")).toBeInTheDocument();
  expect(screen.getByText("Name")).toBeInTheDocument();
  expect(screen.getByText("Shebin")).toBeInTheDocument();
  expect(screen.getByText("Rahul")).toBeInTheDocument();
});
