import { describe, it, expect, vi } from "vitest";
import WrappedAdminPatients from "../hoc/AdminPatients.withUserMap";

vi.mock("../pages/admin/AdminPatient", () => {
  const AdminPatients = () => <div data-testid="mock-admin-patients">Admin Patients Base View</div>;
  return { default: AdminPatients };
});

describe("AdminPatients withUserMap HOC Bridge", () => {
  it("should securely bind and export the wrapped component with the correct contextual display configuration", () => {
    expect(WrappedAdminPatients).toBeDefined();
    expect(WrappedAdminPatients.displayName).toBe("withUsersMap(AdminPatients)");
  });
});