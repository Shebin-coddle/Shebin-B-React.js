import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../components/home/Footer";

describe("Footer Component", () => {
  it("should display hospital branding descriptions and core structural text", () => {
    render(<Footer />);

    expect(
      screen.getByRole("heading", { level: 2, name: "City Hospital" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Providing quality healthcare services/i),
    ).toBeInTheDocument();
  });

  it("should render navigation shortcuts and contact parameters correctly", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "#home",
    );
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "#services",
    );
    expect(screen.getByRole("link", { name: "Appointment" })).toHaveAttribute(
      "href",
      "#appointment",
    );

    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("+91 6238922842")).toBeInTheDocument();
    expect(screen.getByText("info@cityhospital.com")).toBeInTheDocument();
    expect(screen.getByText("Calicut, Kerala, India")).toBeInTheDocument();
  });

  it("should output the dynamic system time matching current year metrics in bottom banner", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
