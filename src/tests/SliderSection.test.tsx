import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SliderSection from "../components/home/SliderSection";

describe("SliderSection Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the initial slide copy structures cleanly", () => {
    render(<SliderSection />);

    expect(
      screen.getByRole("heading", { level: 2, name: "We Value Your Trust" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Experienced doctors, advanced medical facilities/i),
    ).toBeInTheDocument();

    const imageElement = screen.getByAltText("We Value Your Trust");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute("src")).toContain("slider-1.jpg");
  });

  it("should advance state variables sequentially when the background interval ticks", () => {
    render(<SliderSection />);

    expect(
      screen.getByRole("heading", { level: 2, name: "We Value Your Trust" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Advanced Medical Technology",
      }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "24/7 Emergency Services",
      }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(
      screen.getByRole("heading", { level: 2, name: "We Value Your Trust" }),
    ).toBeInTheDocument();
  });

  it("should change slide visibility manually when custom pagination indicators are clicked", () => {
    render(<SliderSection />);

    const dots = screen.getAllByRole("button");
    expect(dots).toHaveLength(3);

    fireEvent.click(dots[2]);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "24/7 Emergency Services",
      }),
    ).toBeInTheDocument();
    expect(dots[2].className).toContain("active");

    fireEvent.click(dots[1]);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Advanced Medical Technology",
      }),
    ).toBeInTheDocument();
    expect(dots[1].className).toContain("active");
  });
});
