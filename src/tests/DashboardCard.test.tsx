import { render, screen } from "@testing-library/react";
import DashboardCard from "../pages/dashboards/DashboardCard";

test("renders dashboard card title and count", () => {
  render(<DashboardCard title="Total Users" count={10} />);

  expect(screen.getByText("Total Users")).toBeInTheDocument();
  expect(screen.getByText("10")).toBeInTheDocument();
});
