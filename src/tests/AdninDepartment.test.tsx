import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import AdminDepartments from "../pages/admin/AdminDepartment";

import {
  mockGetAllDepartments,
  mockUpdateDepartment,
} from "./mocks/ServicesMock";

describe("AdminDepartments", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAllDepartments.mockResolvedValue([
      {
        id: 1,
        department_name: "Cardiology",
        contact_number: "1234567890",
      },
    ]);
  });

  it("renders departments table", async () => {
    render(<AdminDepartments />);

    expect(await screen.findByText("Cardiology")).toBeInTheDocument();
  });

  it("shows selected department details", async () => {
    render(<AdminDepartments />);

    fireEvent.click(await screen.findByText("View"));

    expect(
      await screen.findByText("Selected Department Details")
    ).toBeInTheDocument();
  });

  it("opens edit form", async () => {
    render(<AdminDepartments />);

    fireEvent.click(await screen.findByText("Edit"));

    expect(
      await screen.findByText("Edit Department")
    ).toBeInTheDocument();
  });

  it("updates department successfully", async () => {
    mockUpdateDepartment.mockResolvedValue({});

    render(<AdminDepartments />);

    fireEvent.click(await screen.findByText("Edit"));

    fireEvent.change(
      screen.getByDisplayValue("Cardiology"),
      {
        target: {
          value: "Neurology",
          name: "department_name",
        },
      }
    );

  fireEvent.click(
  screen.getByRole("button", { name: /update/i })
);

    await waitFor(() =>
      expect(mockUpdateDepartment).toHaveBeenCalled()
    );
  });

  it("handles fetch error", async () => {
    mockGetAllDepartments.mockRejectedValue(
      new Error("Failed to load")
    );

    render(<AdminDepartments />);

    expect(
      await screen.findByText("Failed to load")
    ).toBeInTheDocument();
  });

  it("handles non Error fetch failure", async () => {
    mockGetAllDepartments.mockRejectedValue("failure");

    render(<AdminDepartments />);

    expect(
      await screen.findByText(
        "Error occurred while fetching departments"
      )
    ).toBeInTheDocument();
  });

  it("handles update error", async () => {
    mockUpdateDepartment.mockRejectedValue(
      new Error("Update failed")
    );

    render(<AdminDepartments />);

    fireEvent.click(await screen.findByText("Edit"));

   fireEvent.click(
  screen.getByRole("button", { name: /update/i })
);

    expect(
      await screen.findByText("Update failed")
    ).toBeInTheDocument();
  });
});