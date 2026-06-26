import { describe, it, expect, vi } from "vitest";

const { getAdminDashboardSummary } = await vi.importActual<typeof import("../services/DashboardService")>("../services/DashboardService");

vi.mock("../services/UserService", () => ({ getAllUsers: vi.fn(() => Promise.resolve([1, 2, 3])) }));
vi.mock("../services/DoctorService", () => ({ getAllDoctors: vi.fn(() => Promise.resolve([1, 2])) }));
vi.mock("../services/PatientService", () => ({ getAllPatients: vi.fn(() => Promise.resolve([1, 2, 3, 4])) }));
vi.mock("../services/NurseService", () => ({ getAllNurses: vi.fn(() => Promise.resolve([1])) }));
vi.mock("../services/AppointmentService", () => ({ getAllAppointments: vi.fn(() => Promise.resolve([1, 2, 3, 4, 5])) }));
vi.mock("../services/BillService", () => ({ getAllBills: vi.fn(() => Promise.resolve([1, 2])) }));
vi.mock("../services/DepartmentService", () => ({ getAllDepartments: vi.fn(() => Promise.resolve([1, 2, 3])) }));
vi.mock("../services/MedicineService", () => ({ getAllMedicines: vi.fn(() => Promise.resolve([1, 2, 3, 4, 5, 6])) }));

describe("DashboardService", () => {
  it("should aggregate and return total element counts for all service arrays concurrently", async () => {
    const summary = await getAdminDashboardSummary();

    expect(summary).toEqual({
      totalUsers: 3,
      totalDoctors: 2,
      totalPatients: 4,
      totalNurses: 1,
      totalAppointments: 5,
      totalBills: 2,
      totalDepartments: 3,
      totalMedicines: 6,
    });
  });
});