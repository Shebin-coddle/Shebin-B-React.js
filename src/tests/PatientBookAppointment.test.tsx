import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import PatientBookAppointment from "../pages/patient/PatientBookAppointment";

import {
  mockGetAllDepartments,
  mockGetDoctorsWithDetails,
  mockCreateAppointment,
} from "../tests/mocks/ServicesMock";

describe("PatientBookAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.setItem("user_id", "1");

    mockGetAllDepartments.mockResolvedValue([
      {
        id: 1,
        department_name: "Cardiology",
      },
    ]);

    mockGetDoctorsWithDetails.mockResolvedValue([
      {
        user_id: 10,
        first_name: "John",
        last_name: "Doe",
        specialization: "Heart",
        department_id: 1,
      },
    ]);
  });

  it("renders appointment form", async () => {
    render(<PatientBookAppointment />);

expect(
  screen.getByRole("heading", { name: /book appointment/i })
).toBeInTheDocument();

    expect(screen.getByTestId("department-select")).toBeInTheDocument();
    expect(screen.getByTestId("doctor-select")).toBeInTheDocument();
  });

  it("shows error when department not selected", async () => {
    render(<PatientBookAppointment />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: /book appointment/i,
      })
    );

    expect(
      await screen.findByText("Please select a department")
    ).toBeInTheDocument();
  });

  it("shows error when doctor not selected", async () => {
    render(<PatientBookAppointment />);

    const department = await screen.findByTestId("department-select");

    fireEvent.change(department, {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /book appointment/i }));

    expect(
      await screen.findByText("Please select a doctor")
    ).toBeInTheDocument();
  });

  it("shows error when date not selected", async () => {
    render(<PatientBookAppointment />);

    fireEvent.change(await screen.findByTestId("department-select"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByTestId("doctor-select"), {
      target: { value: "10" },
    });

    fireEvent.click(screen.getByRole("button", { name: /book appointment/i }));

    expect(
      await screen.findByText("Please select appointment date")
    ).toBeInTheDocument();
  });

  it("shows error when start time missing", async () => {
    render(<PatientBookAppointment />);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    fireEvent.change(await screen.findByTestId("department-select"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByTestId("doctor-select"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByTestId("appointment-date"), {
      target: {
        value: futureDate.toISOString().split("T")[0],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /book appointment/i }));

    expect(
      await screen.findByText("Please select start time")
    ).toBeInTheDocument();
  });

  it("shows error when end time is before start time", async () => {
    render(<PatientBookAppointment />);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    fireEvent.change(await screen.findByTestId("department-select"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByTestId("doctor-select"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByTestId("appointment-date"), {
      target: {
        value: futureDate.toISOString().split("T")[0],
      },
    });

    fireEvent.change(screen.getByTestId("start-time"), {
      target: { value: "11:00" },
    });

    fireEvent.change(screen.getByTestId("end-time"), {
      target: { value: "10:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /book appointment/i }));

    expect(
      await screen.findByText("End time must be after start time")
    ).toBeInTheDocument();
  });

  it("books appointment successfully", async () => {
    mockCreateAppointment.mockResolvedValue({});

    render(<PatientBookAppointment />);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    fireEvent.change(await screen.findByTestId("department-select"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByTestId("doctor-select"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByTestId("appointment-date"), {
      target: {
        value: futureDate.toISOString().split("T")[0],
      },
    });

    fireEvent.change(screen.getByTestId("start-time"), {
      target: { value: "09:00" },
    });

    fireEvent.change(screen.getByTestId("end-time"), {
      target: { value: "10:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /book appointment/i }));

    await waitFor(() =>
      expect(mockCreateAppointment).toHaveBeenCalled()
    );

    expect(
      await screen.findByText(
        "Appointment request submitted successfully"
      )
    ).toBeInTheDocument();
  });

  it("handles booking failure", async () => {
    mockCreateAppointment.mockRejectedValue(
      new Error("Booking failed")
    );

    render(<PatientBookAppointment />);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    fireEvent.change(await screen.findByTestId("department-select"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByTestId("doctor-select"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByTestId("appointment-date"), {
      target: {
        value: futureDate.toISOString().split("T")[0],
      },
    });

    fireEvent.change(screen.getByTestId("start-time"), {
      target: { value: "09:00" },
    });

    fireEvent.change(screen.getByTestId("end-time"), {
      target: { value: "10:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /book appointment/i }));

    expect(
      await screen.findByText("Booking failed")
    ).toBeInTheDocument();
  });

  it("handles non Error object while loading data", async () => {
  mockGetAllDepartments.mockRejectedValue("failure");

  render(<PatientBookAppointment />);

  expect(
    await screen.findByText(
      "Error occurred while loading appointment data"
    )
  ).toBeInTheDocument();
});

it("handles non Error object while booking appointment", async () => {
  mockCreateAppointment.mockRejectedValue("failure");

  render(<PatientBookAppointment />);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);

  fireEvent.change(
    await screen.findByTestId("department-select"),
    { target: { value: "1" } }
  );

  fireEvent.change(
    screen.getByTestId("doctor-select"),
    { target: { value: "10" } }
  );

  fireEvent.change(
    screen.getByTestId("appointment-date"),
    {
      target: {
        value: futureDate.toISOString().split("T")[0],
      },
    }
  );

  fireEvent.change(
    screen.getByTestId("start-time"),
    { target: { value: "09:00" } }
  );

  fireEvent.change(
    screen.getByTestId("end-time"),
    { target: { value: "10:00" } }
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: /book appointment/i,
    })
  );

  expect(
    await screen.findByText(
      "Error occurred while booking appointment"
    )
  ).toBeInTheDocument();
});
});