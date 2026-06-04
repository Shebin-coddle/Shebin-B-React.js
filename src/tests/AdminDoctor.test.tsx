import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminDoctors from "../pages/admin/AdminDoctor";

import {
  mockGetAllDoctors,
  mockUpdateDoctor,
} from "./mocks/ServicesMock";

describe("AdminDoctors", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAllDoctors.mockResolvedValue([
      {
        user_id: 1,
        specialization: "Cardiology",
        salary: 50000,
        department_id: 1,
      },
    ]);
  });

  it("renders doctors table", async () => {
    render(<AdminDoctors />);

    expect(
      await screen.findByText("Cardiology")
    ).toBeInTheDocument();
  });

  it("shows doctor details", async () => {
    render(<AdminDoctors />);

    fireEvent.click(await screen.findByText("View"));

    expect(
      await screen.findByText("Selected Doctor Details")
    ).toBeInTheDocument();
  });

  it("opens edit form", async () => {
    render(<AdminDoctors />);

    fireEvent.click(await screen.findByText("Edit"));

    expect(
      await screen.findByText("Edit Doctor")
    ).toBeInTheDocument();
  });

  it("updates doctor successfully", async () => {
    mockUpdateDoctor.mockResolvedValue({});

    render(<AdminDoctors />);

    fireEvent.click(await screen.findByText("Edit"));

    fireEvent.change(
      screen.getByDisplayValue("Cardiology"),
      {
        target: {
          name: "specialization",
          value: "Neurology",
        },
      }
    );

    fireEvent.change(
      screen.getByDisplayValue("50000"),
      {
        target: {
          name: "salary",
          value: "70000",
        },
      }
    );

    fireEvent.change(
      screen.getByDisplayValue("1"),
      {
        target: {
          name: "department_id",
          value: "2",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /update/i })
    );

    await waitFor(() => {
      expect(mockUpdateDoctor).toHaveBeenCalled();
    });
  });

  it("handles fetch error", async () => {
    mockGetAllDoctors.mockRejectedValue(
      new Error("Failed to load doctors")
    );

    render(<AdminDoctors />);

    expect(
      await screen.findByText("Failed to load doctors")
    ).toBeInTheDocument();
  });

  it("handles non Error fetch failure", async () => {
    mockGetAllDoctors.mockRejectedValue("failure");

    render(<AdminDoctors />);

    expect(
      await screen.findByText(
        "Error occurred while fetching doctors"
      )
    ).toBeInTheDocument();
  });

  it("handles update error", async () => {
    mockUpdateDoctor.mockRejectedValue(
      new Error("Update failed")
    );

    render(<AdminDoctors />);

    fireEvent.click(await screen.findByText("Edit"));

    fireEvent.click(
      screen.getByRole("button", { name: /update/i })
    );

    expect(
      await screen.findByText("Update failed")
    ).toBeInTheDocument();
  });

  it("handles non Error update failure", async () => {
    mockUpdateDoctor.mockRejectedValue("failure");

    render(<AdminDoctors />);

    fireEvent.click(await screen.findByText("Edit"));

    fireEvent.click(
      screen.getByRole("button", { name: /update/i })
    );

    expect(
      await screen.findByText(
        "Error occurred while updating doctor"
      )
    ).toBeInTheDocument();
  });
});