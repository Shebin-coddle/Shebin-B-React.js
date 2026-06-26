import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesSection from "../components/home/ServiceSection";

describe("ServicesSection Component", () => {
  it("should render headers and core contextual copy block perfectly", () => {
    render(<ServicesSection />);

    expect(screen.getByText("Our Services")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Healthcare Services We Provide",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Delivering quality healthcare through specialized departments/i,
      ),
    ).toBeInTheDocument();
  });

  it("should map over and render all hospital department service entries correctly", () => {
    render(<ServicesSection />);

    const expectedServices = [
      {
        title: "Cardiology",
        desc: "Comprehensive heart care with advanced diagnostics and treatments.",
      },
      {
        title: "Neurology",
        desc: "Specialized care for brain, spine, and nervous system disorders.",
      },
      {
        title: "Orthopedics",
        desc: "Expert treatment for bones, joints, muscles, and injuries.",
      },
      {
        title: "Pediatrics",
        desc: "Dedicated healthcare services for infants, children, and adolescents.",
      },
      {
        title: "Emergency Care",
        desc: "24/7 emergency services with rapid response and expert care.",
      },
    ];

    expectedServices.forEach((service) => {
      const headingElement = screen.getByRole("heading", {
        level: 3,
        name: service.title,
      });
      const textElement = screen.getByText(service.desc);

      expect(headingElement).toBeInTheDocument();
      expect(textElement).toBeInTheDocument();
    });
  });
});
