import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardCard from "../pages/dashboards/DashboardCard";

describe("DashboardCard Component", () => {
  it("should render the title and string count values accurately", () => {
    render(<DashboardCard title="Total Doctors" count="15" />);

    expect(screen.getByRole("heading", { level: 3, name: "Total Doctors" })).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("should render numeric count inputs cleanly", () => {
    render(<DashboardCard title="Pending Appointments" count={150} />);

    expect(screen.getByRole("heading", { level: 3, name: "Pending Appointments" })).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });
});