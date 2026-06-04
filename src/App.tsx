import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import NurseDashboard from "./pages/dashboards/NurseDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import NotFound from "./pages/PageNotFound";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDoctors from "./pages/admin/AdminDoctor";
import AdminPatients from "./pages/admin/AdminPatient";
import AdminNurses from "./pages/admin/AdminNurse";
import AdminAppointments from "./pages/admin/AdminAppointment";
import AdminBills from "./pages/admin/AdminBills";
import AdminDepartments from "./pages/admin/AdminDepartment";
import AdminMedicines from "./pages/admin/AdminMedicine";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import PatientBookAppointment from "./pages/patient/PatientBookAppointment";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientBills from "./pages/patient/PatientBills";
import PatientMedicalRecords from "./pages/patient/PatientMedicalRecords";
import NurseAppointments from "./pages/nurse/NurseAppointments";
import Layout from "./components/layout/Layout";
import UserForm from "./pages/admin/UserForm";
import PatientEditForm from "./pages/admin/PatientEditForm";
import DoctorEditForm from "./pages/admin/DoctorEditForm";
import NurseEditForm from "./pages/admin/NurseEditForm";
import DepartmentForm from "./pages/admin/DepartmentForm";
import MedicineForm from "./pages/admin/MedicineForm";
import AppointmentForm from "./pages/admin/AppointmentForm";
import BillForm from "./pages/admin/BillForm";
import {
  adminMenu,
  doctorMenu,
  nurseMenu,
  patientMenu,
} from "./components/layout/Menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Layout
                sidebarTitle="Hospital Admin"
                topbarTitle="Admin Dashboard"
                menuItems={adminMenu}
              />
            }
          >
            {" "}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-users/add" element={<UserForm />} />
            <Route path="/admin-users/edit/:id" element={<UserForm />} />
            <Route path="/admin-doctors" element={<AdminDoctors />} />
            <Route
              path="/admin-doctors/edit/:userId"
              element={<DoctorEditForm />}
            ></Route>
            <Route path="/admin-patients" element={<AdminPatients />} />
            <Route
              path="/admin-patients/edit/:userId"
              element={<PatientEditForm />}
            ></Route>
            <Route path="/admin-nurses" element={<AdminNurses />} />
            <Route
              path="/admin-nurses/edit/:userId"
              element={<NurseEditForm />}
            ></Route>
            <Route path="/admin-appointments" element={<AdminAppointments />} />
            <Route
              path="/admin-appointments/add"
              element={<AppointmentForm />}
            />
            <Route
              path="/admin-appointments/edit/:id"
              element={<AppointmentForm />}
            />
            <Route path="/admin-bills" element={<AdminBills />} />
            <Route path="/admin-bills/add" element={<BillForm />} />
            <Route path="/admin-bills/edit/:id" element={<BillForm />} />
            <Route path="/admin-departments" element={<AdminDepartments />} />
            <Route path="/admin-medicines" element={<AdminMedicines />} />
            <Route path="/admin-medicines/add" element={<MedicineForm />} />
            <Route
              path="/admin-medicines/edit/:id"
              element={<MedicineForm />}
            />
            <Route path="/admin-departments/add" element={<DepartmentForm />} />
            <Route
              path="/admin-departments/edit/:id"
              element={<DepartmentForm />}
            />
          </Route>
          <Route
            element={
              <Layout
                sidebarTitle="Doctor Portal"
                topbarTitle="Doctor Dashboard"
                menuItems={doctorMenu}
              />
            }
          >
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route
              path="/doctor-appointments"
              element={<DoctorAppointments />}
            />
          </Route>

          <Route
            element={
              <Layout
                sidebarTitle="Nurse Portal"
                topbarTitle="Nurse Dashboard"
                menuItems={nurseMenu}
              />
            }
          >
            <Route path="/nurse-dashboard" element={<NurseDashboard />} />
            <Route path="/nurse-appointments" element={<NurseAppointments />} />
          </Route>
          <Route
            element={
              <Layout
                sidebarTitle="Patient Portal"
                topbarTitle="Patient Dashboard"
                menuItems={patientMenu}
              />
            }
          >
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route
              path="/patient-book-appointment"
              element={<PatientBookAppointment />}
            />
            <Route
              path="/patient-appointments"
              element={<PatientAppointments />}
            />
            <Route path="/patient-bills" element={<PatientBills />} />
            <Route
              path="/patient-medical-records"
              element={<PatientMedicalRecords />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
