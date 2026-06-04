import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";

import AdminLayout from "../components/layout/AdminLayout";
import DoctorLayout from "../components/layout/DoctorLayout";
import PatientLayout from "../components/layout/PatientLayout";
import NurseLayout from "../components/layout/NurseLayout";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockClear();
});

test("renders admin layout with sidebar and outlet", () => {
  render(
    <MemoryRouter initialEntries={["/admin-dashboard"]}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<h2>Admin Content</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Hospital Admin")).toBeInTheDocument();
  expect(screen.getByText("Admin Content")).toBeInTheDocument();
});

test("renders doctor layout with sidebar and outlet", () => {
  render(
    <MemoryRouter initialEntries={["/doctor-dashboard"]}>
      <Routes>
        <Route element={<DoctorLayout />}>
          <Route path="/doctor-dashboard" element={<h2>Doctor Content</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Doctor Panel")).toBeInTheDocument();
  expect(screen.getByText("Doctor Content")).toBeInTheDocument();
});

test("renders patient layout with sidebar and outlet", () => {
  render(
    <MemoryRouter initialEntries={["/patient-dashboard"]}>
      <Routes>
        <Route element={<PatientLayout />}>
          <Route path="/patient-dashboard" element={<h2>Patient Content</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Patient Panel")).toBeInTheDocument();
  expect(screen.getByText("Patient Content")).toBeInTheDocument();
});

test("renders nurse layout with sidebar and outlet", () => {
  render(
    <MemoryRouter initialEntries={["/nurse-dashboard"]}>
      <Routes>
        <Route element={<NurseLayout />}>
          <Route path="/nurse-dashboard" element={<h2>Nurse Content</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Nurse Panel")).toBeInTheDocument();
  expect(screen.getByText("Nurse Content")).toBeInTheDocument();
});

test("logout clears localStorage and navigates to login", () => {
  localStorage.setItem("token", "test-token");
  localStorage.setItem("role_id", "1");

  render(
    <MemoryRouter initialEntries={["/admin-dashboard"]}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<h2>Admin Content</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByText("Logout"));

  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("role_id")).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
});