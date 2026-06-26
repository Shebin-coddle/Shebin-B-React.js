import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import BreadCrumbs from "../components/BreadCrumps";

const mockUseLocation = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  };
});

vi.mock("../components/Labels/BreadCrumpsLabels", () => ({
  labels: {
    admin: "Administration",
    appointments: "Appointments Matrix",
  },
}));

describe("BreadCrumbs Component", () => {
  it("should render root home routing reference link when pathname is bare root", () => {
    mockUseLocation.mockReturnValue({ pathname: "/" });

    render(
      <BrowserRouter>
        <BreadCrumbs />
      </BrowserRouter>
    );

    const homeLink = screen.getByText("Home");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute("href")).toBe("/");
  });

  it("should parse path segments matching definitions inside structural labels matrix cleanly", () => {
    mockUseLocation.mockReturnValue({ pathname: "/admin/appointments" });

    render(
      <BrowserRouter>
        <BreadCrumbs />
      </BrowserRouter>
    );

    const homeLink = screen.getByText("Home");
    const adminLink = screen.getByText("Administration");
    const appointmentsLink = screen.getByText("Appointments Matrix");

    expect(homeLink).toBeInTheDocument();
    expect(adminLink).toBeInTheDocument();
    expect(appointmentsLink).toBeInTheDocument();

    expect(adminLink.getAttribute("href")).toBe("/admin");
    expect(appointmentsLink.getAttribute("href")).toBe("/admin/appointments");
  });
});