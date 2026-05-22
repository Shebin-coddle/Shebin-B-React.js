import { getAllUsers } from "./UserService";
import { getAllDoctors } from "./DoctorService";
import { getAllPatients } from "./PatientService";
import { getAllNurses } from "./NurseService";
import { getAllAppointments } from "./AppointmentService";
import { getAllBills } from "./BillService";
import { getAllDepartments } from "./DepartmentService";
import { getAllMedicines } from "./MedicineService";

export type AdminDashboardSummary = {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalNurses: number;
  totalAppointments: number;
  totalBills: number;
  totalDepartments: number;
  totalMedicines: number;
};

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const [
    users,
    doctors,
    patients,
    nurses,
    appointments,
    bills,
    departments,
    medicines,
  ] = await Promise.all([
    getAllUsers(),
    getAllDoctors(),
    getAllPatients(),
    getAllNurses(),
    getAllAppointments(),
    getAllBills(),
    getAllDepartments(),
    getAllMedicines(),
  ]);

  return {
    totalUsers: users.length,
    totalDoctors: doctors.length,
    totalPatients: patients.length,
    totalNurses: nurses.length,
    totalAppointments: appointments.length,
    totalBills: bills.length,
    totalDepartments: departments.length,
    totalMedicines: medicines.length,
  };
}
