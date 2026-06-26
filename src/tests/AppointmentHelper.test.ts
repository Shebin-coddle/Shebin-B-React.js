import { describe, it, expect, beforeEach, vi } from "vitest";
import { showWarning } from "../utils/toast";

const {
  HandleBookAppointments,
} = await vi.importActual<typeof import("../services/HandleBookAppointments")>("../services/HandleBookAppointments.ts");

vi.mock("../utils/toast", () => ({
  showWarning: vi.fn(),
}));

describe("AppointmentNavigationHelper - HandleBookAppointments", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should route to login screen and trigger warning message when role context is missing", () => {
    HandleBookAppointments(mockNavigate, null);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(showWarning).toHaveBeenCalledWith("Login to book appointment");
  });

  it("should directly route to doctor listing screen when role context belongs to a patient", () => {
    HandleBookAppointments(mockNavigate, 3);

    expect(mockNavigate).toHaveBeenCalledWith("/doctor-list");
    expect(showWarning).not.toHaveBeenCalled();
  });

  it("should display a restrictive warning message when an authorized role is not a patient", () => {
    HandleBookAppointments(mockNavigate, 2);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(showWarning).toHaveBeenCalledWith("Only patients can book appointments");
  });
});