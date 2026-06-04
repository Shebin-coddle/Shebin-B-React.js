import { render, screen } from "@testing-library/react";
import AdminDashboard from "../pages/dashboards/adminDashboard";
import DoctorDashboard from "../pages/dashboards/doctorDashboard";
import NurseDashboard from "../pages/dashboards/nurseDashboard";
import PatientDashboard from "../pages/dashboards/patientDashboard";

test("renders admin dashboard", () => {
  render(<AdminDashboard />);
  expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
});

test("renders doctor dashboard", () => {
  render(<DoctorDashboard />);
  expect(screen.getByText("Doctor Dashboard")).toBeInTheDocument();
});

test("renders nurse dashboard", () => {
  render(<NurseDashboard />);
  expect(screen.getByText("Nurse Dashboard")).toBeInTheDocument();
});

test("renders patient dashboard", () => {
  render(<PatientDashboard />);
  expect(screen.getByText("Patient Dashboard")).toBeInTheDocument();
});
