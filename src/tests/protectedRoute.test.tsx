import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../routes/protectedRoute";

beforeEach(() => {
  localStorage.clear();
});

test("redirects to login if token is missing", () => {
  render(
    <MemoryRouter initialEntries={["/admin-dashboard"]}>
      <Routes>
        <Route path="/" element={<h1>Login Page</h1>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin-dashboard" element={<h1>Admin Dashboard</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Login Page")).toBeInTheDocument();
});

test("allows admin user to access admin dashboard", () => {
  localStorage.setItem("token", "test-token");
  localStorage.setItem("role_id", "1");

  render(
    <MemoryRouter initialEntries={["/admin-dashboard"]}>
      <Routes>
        <Route path="/" element={<h1>Login Page</h1>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin-dashboard" element={<h1>Admin Dashboard</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
});

test("blocks patient from admin dashboard", () => {
  localStorage.setItem("token", "test-token");
  localStorage.setItem("role_id", "3");

  render(
    <MemoryRouter initialEntries={["/admin-dashboard"]}>
      <Routes>
        <Route path="/" element={<h1>Login Page</h1>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin-dashboard" element={<h1>Admin Dashboard</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Login Page")).toBeInTheDocument();
});

test("allows doctor user to access doctor dashboard", () => {
  localStorage.setItem("token", "test-token");
  localStorage.setItem("role_id", "2");

  render(
    <MemoryRouter initialEntries={["/doctor-dashboard"]}>
      <Routes>
        <Route path="/" element={<h1>Login Page</h1>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/doctor-dashboard" element={<h1>Doctor Dashboard</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Doctor Dashboard")).toBeInTheDocument();
});

test("allows patient user to access patient dashboard", () => {
  localStorage.setItem("token", "test-token");
  localStorage.setItem("role_id", "3");

  render(
    <MemoryRouter initialEntries={["/patient-dashboard"]}>
      <Routes>
        <Route path="/" element={<h1>Login Page</h1>} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/patient-dashboard"
            element={<h1>Patient Dashboard</h1>}
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Patient Dashboard")).toBeInTheDocument();
});

test("allows nurse user to access nurse dashboard", () => {
  localStorage.setItem("token", "test-token");
  localStorage.setItem("role_id", "4");

  render(
    <MemoryRouter initialEntries={["/nurse-dashboard"]}>
      <Routes>
        <Route path="/" element={<h1>Login Page</h1>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/nurse-dashboard" element={<h1>Nurse Dashboard</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Nurse Dashboard")).toBeInTheDocument();
});
